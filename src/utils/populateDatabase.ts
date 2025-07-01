import { seedProducts, checkProductCount } from './seedProducts';

// Função para popular o banco (pode ser chamada do console do navegador)
export async function populateDatabase() {
  console.log('🔄 Iniciando população do banco de dados...');
  
  // Verificar quantos produtos já existem
  const currentCount = await checkProductCount();
  console.log(`📊 Produtos atuais no banco: ${currentCount}`);
  
  if (currentCount > 0) {
    console.log('⚠️ Banco já possui produtos. Pulando população...');
    return;
  }
  
  // Popular com produtos de exemplo
  const success = await seedProducts();
  
  if (success) {
    console.log('✅ Banco populado com sucesso!');
    console.log('🎉 Agora você pode testar a busca por: vestido, blusa, calça, sapato, etc.');
  } else {
    console.error('❌ Erro ao popular banco');
  }
}

// Função para verificar status do banco
export async function checkDatabaseStatus() {
  const count = await checkProductCount();
  console.log(`📊 Status do banco: ${count} produtos`);
  
  if (count === 0) {
    console.log('💡 Dica: Execute populateDatabase() para adicionar produtos de exemplo');
  } else {
    console.log('✅ Banco está pronto para uso!');
  }
}

// Expor funções globalmente para uso no console
if (typeof window !== 'undefined') {
  (window as any).populateDatabase = populateDatabase;
  (window as any).checkDatabaseStatus = checkDatabaseStatus;
} 