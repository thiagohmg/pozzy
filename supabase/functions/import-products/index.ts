
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function parseGoogleShoppingJSON(json: any): any[] {
  // Espera-se um array de produtos
  if (!Array.isArray(json)) return [];
  return json.map((item) => ({
    id: item.id || crypto.randomUUID(),
    name: item.title || item.name || '',
    description: item.description || '',
    price: parseFloat((item.price || item.selling_price || 0).toString().replace(/[^\d,.-]/g, '').replace(',', '.')),
    brand: item.brand || item.gtin || '',
    image_url: item.image_link || item.image || '',
    url: item.link || item.url || '',
    category: item.google_product_category || '',
    color: item.color || '',
    in_stock: !item.availability || item.availability.toLowerCase() === 'in stock',
    data: item,
  }));
}

// Função exemplo de tratamento Zara (os sites mudam muito! Exemplo para data pública estruturada)
function parseZaraJSON(json: any): any[] {
  // A Zara não tem API pública; Exemplo usando formato simulado de integração.
  if (!Array.isArray(json.products)) return [];
  return json.products.map((item: any) => ({
    id: item.id || crypto.randomUUID(),
    name: item.name || '',
    description: item.description || '',
    price: parseFloat(item.price?.toString() ?? "0"),
    brand: "Zara",
    image_url: item.images && item.images[0]?.url ? item.images[0].url : '',
    url: item.url || '',
    category: item.category || '',
    color: item.color || '',
    in_stock: item.available ?? true,
    data: item,
  }));
}

async function importProductsFromUrl(feedUrl: string, source: string) {
  const res = await fetch(feedUrl);
  let items: any[] = [];

  if (source === "google") {
    // Suportando JSON e simulando CSV ou XML no futuro.
    const data = await res.json();
    items = parseGoogleShoppingJSON(data);
  } else if (source === "zara") {
    const data = await res.json();
    items = parseZaraJSON(data);
  }
  // Adicione outros marketplaces conforme expandir: amazon, dafiti, renner, etc

  const chunk = 100; // máximo supabase insert
  let imported = 0;
  for (let i = 0; i < items.length; i += chunk) {
    const batch = items.slice(i, i + chunk);
    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id' });
    if (!error) imported += batch.length;
  }

  return imported;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedUrl, source } = await req.json();
    if (!feedUrl || !source) {
      return new Response(JSON.stringify({ error: "feedUrl and source required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const imported = await importProductsFromUrl(feedUrl, source);
    return new Response(JSON.stringify({ status: "ok", imported }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
