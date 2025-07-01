import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar ícones SVG simples para o PWA
const createIconSVG = (size, color = '#7c3aed') => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size/4}" fill="${color}"/>
  <text x="${size/2}" y="${size/2 + size/8}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size/3}" font-weight="bold">P</text>
</svg>`;
};

// Criar ícones
const icons = [
  { name: 'icon-16x16.svg', size: 16 },
  { name: 'icon-32x32.svg', size: 32 },
  { name: 'icon-192x192.svg', size: 192 },
  { name: 'icon-512x512.svg', size: 512 },
  { name: 'maskable-icon-512x512.svg', size: 512 },
  { name: 'shortcut-discover.svg', size: 192 },
  { name: 'shortcut-consultoria.svg', size: 192 }
];

const iconsDir = path.join(__dirname, '../public/icons');

// Criar diretório se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Gerar ícones
icons.forEach(icon => {
  const svg = createIconSVG(icon.size);
  const filePath = path.join(iconsDir, icon.name);
  fs.writeFileSync(filePath, svg);
  console.log(`✅ Criado: ${icon.name}`);
});

// Criar splash screens
const splashDir = path.join(__dirname, '../public/splash');
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
}

const splashScreens = [
  'apple-splash-2048-2732.svg',
  'apple-splash-1668-2388.svg',
  'apple-splash-1536-2048.svg',
  'apple-splash-1125-2436.svg',
  'apple-splash-1242-2688.svg'
];

splashScreens.forEach(screen => {
  const svg = createIconSVG(512, '#7c3aed');
  const filePath = path.join(splashDir, screen);
  fs.writeFileSync(filePath, svg);
  console.log(`✅ Criado: ${screen}`);
});

console.log('\n🎨 Ícones do PWA criados com sucesso!');
console.log('📝 Nota: Em produção, converta os SVGs para PNGs usando uma ferramenta como sharp ou canvas.'); 