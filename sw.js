const CACHE_NAME = 'pozzy-cache-v1.2'; // Incrementar para forçar atualização
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index.css', 
  '/assets/index.js',
  // Adicionar outros assets estáticos principais que você queira cachear
  // Ex: '/logo.png', '/offline.html'
];

// Evento de instalação: abre o cache e armazena os assets principais
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache aberto. Adicionando URLs ao cache:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] URLs cacheadas com sucesso. Instalação completa.');
        return self.skipWaiting(); // Força o novo service worker a se tornar ativo
      })
      .catch(error => {
        console.error('[Service Worker] Falha ao cachear URLs durante a instalação:', error);
      })
  );
});

// Evento de ativação: limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        console.log('[Service Worker] Caches antigos limpos. Ativação completa.');
        return self.clients.claim(); // Torna-se o controlador para todos os clientes no escopo
    })
  );
});

// Evento de fetch: intercepta requisições e serve do cache se disponível (estratégia Cache First)
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ignora requisições para a API do Supabase ou outras APIs de terceiros
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se a resposta estiver no cache, retorna ela
        if (response) {
          // console.log(`[Service Worker] Servindo do cache: ${event.request.url}`);
          return response;
        }

        // Se não estiver no cache, busca na rede
        // console.log(`[Service Worker] Buscando na rede: ${event.request.url}`);
        return fetch(event.request).then(
          networkResponse => {
            // Se a resposta da rede for válida, clona, armazena no cache e retorna
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // console.log(`[Service Worker] Cacheando nova resposta: ${event.request.url}`);
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
      .catch(() => {
        // Se tanto o cache quanto a rede falharem (offline e sem cache),
        // você pode retornar uma página offline de fallback.
        // Ex: return caches.match('/offline.html');
        console.warn(`[Service Worker] Falha ao buscar: ${event.request.url}. O usuário pode estar offline e o recurso não está em cache.`);
      })
  );
});

// Background sync para funcionalidades offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync iniciado');
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização do Pozzy!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Tendências',
        icon: '/icons/shortcut-trends.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Pozzy', options)
  );
});

// Click em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?section=discover&tab=trends')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Função para background sync
async function doBackgroundSync() {
  try {
    // Sincronizar dados offline quando voltar online
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      console.log('Sincronizando dados offline:', offlineData.length);
      // Aqui você implementaria a sincronização com o backend
    }
  } catch (error) {
    console.error('Erro no background sync:', error);
  }
}

// Função para obter dados offline (exemplo)
async function getOfflineData() {
  // Implementar lógica para obter dados salvos offline
  return [];
} 