
/**
 * Calcula faixa (range) de itens de acordo com página/por página.
 * Garante que always retorna valores válidos para Supabase .range(from, to)
 */
export function getRange(page: number, perPage: number) {
  const safePage = Math.max(Number(page || 1), 1);
  const safePerPage = Math.max(Number(perPage || 1), 1);
  const from = (safePage - 1) * safePerPage;
  const to = safePage * safePerPage - 1;
  return { from, to };
}
