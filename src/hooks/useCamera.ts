
import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const getErrorMessage = (error: any) => {
    console.log('🔍 Analisando erro:', error);
    console.log('🔍 Tipo do erro:', error.name);
    console.log('🔍 Mensagem do erro:', error.message);
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return 'Permissão de câmera negada. Permita o acesso à câmera no seu navegador.';
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'Nenhuma câmera encontrada. Verifique se há uma câmera conectada.';
    }
    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return 'Câmera em uso por outro aplicativo. Feche outros programas que usam a câmera.';
    }
    return error.message || 'Erro desconhecido ao acessar a câmera';
  };

  const startCamera = useCallback(async () => {
    console.log('🎥 === INICIANDO PROCESSO DA CÂMERA ===');
    console.log('🎥 1. Verificando navegador...');
    
    // Verificar se o navegador suporta getUserMedia
    if (!navigator.mediaDevices) {
      console.error('❌ navigator.mediaDevices não existe');
      setError('Seu navegador não suporta acesso à câmera');
      return;
    }
    
    if (!navigator.mediaDevices.getUserMedia) {
      console.error('❌ getUserMedia não existe');
      setError('Seu navegador não suporta getUserMedia');
      return;
    }
    
    console.log('✅ Navegador suporta câmera');
    
    setError(null);
    setIsLoading(true);
    setIsReady(false);
    
    try {
      console.log('🎥 2. Parando stream anterior...');
      // Parar stream anterior
      if (stream) {
        stream.getTracks().forEach(track => {
          console.log('🛑 Parando track:', track.kind);
          track.stop();
        });
        setStream(null);
      }

      console.log('🎥 3. Solicitando acesso à câmera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' 
        },
        audio: false
      });

      console.log('✅ Stream obtido com sucesso!');
      console.log('📊 Tracks no stream:', mediaStream.getTracks().length);
      mediaStream.getTracks().forEach((track, index) => {
        console.log(`📹 Track ${index}:`, track.kind, track.enabled, track.readyState);
      });
      
      setStream(mediaStream);
      setIsActive(true); // Ativar primeiro para renderizar o elemento video

      // Aguardar um frame para garantir que o DOM foi atualizado
      await new Promise(resolve => requestAnimationFrame(resolve));

      console.log('🎥 4. Aguardando elemento video estar disponível...');
      const waitForVideoElement = () => {
        return new Promise<void>((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 30; // 3 segundos
          
          const checkVideoElement = () => {
            attempts++;
            console.log(`🔄 Tentativa ${attempts}/${maxAttempts}: Verificando videoRef.current...`);
            
            if (videoRef.current) {
              console.log('✅ Elemento video encontrado!');
              resolve();
            } else if (attempts < maxAttempts) {
              setTimeout(checkVideoElement, 100);
            } else {
              console.error('❌ Timeout: elemento video não encontrado após', maxAttempts * 100, 'ms');
              reject(new Error('Elemento video não encontrado'));
            }
          };
          
          checkVideoElement();
        });
      };

      // Aguardar elemento video estar disponível
      await waitForVideoElement();
      
      console.log('🎥 5. Conectando stream ao elemento video...');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Aguardar vídeo carregar
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current!;
          let attempts = 0;
          const maxAttempts = 50; // 5 segundos
          
          const checkReady = () => {
            attempts++;
            const width = video.videoWidth;
            const height = video.videoHeight;
            
            console.log(`🔄 Tentativa ${attempts}/${maxAttempts}: ${width}x${height}, readyState: ${video.readyState}`);
            
            if (width > 0 && height > 0) {
              console.log('✅ Vídeo está pronto!');
              setIsReady(true);
              resolve();
            } else if (attempts < maxAttempts) {
              setTimeout(checkReady, 100);
            } else {
              console.error('❌ Timeout: vídeo não carregou após', maxAttempts * 100, 'ms');
              reject(new Error('Timeout: vídeo não carregou'));
            }
          };
          
          // Também escutar eventos do video
          video.addEventListener('loadedmetadata', () => {
            console.log('📺 Video loadedmetadata event');
          });
          
          video.addEventListener('canplay', () => {
            console.log('📺 Video canplay event');
          });
          
          checkReady();
        });
      }

      console.log('🎥 6. Configurando estado final...');
      toast({
        title: "Câmera ativada! 📷",
        description: "Agora você pode capturar sua foto"
      });

    } catch (err: any) {
      console.error('❌ === ERRO NO PROCESSO DA CÂMERA ===');
      console.error('❌ Erro completo:', err);
      console.error('❌ Stack trace:', err.stack);
      
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      setIsActive(false);
      setIsReady(false);
      
      toast({
        title: "Erro na câmera",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      console.log('🎥 7. Finalizando processo...');
      setIsLoading(false);
    }
  }, [stream, toast]);

  const stopCamera = useCallback(() => {
    console.log('🛑 === PARANDO CÂMERA ===');
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('🛑 Parando track:', track.kind);
        track.stop();
      });
    }
    if (videoRef.current) {
      console.log('🛑 Removendo stream do video element');
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsActive(false);
    setIsReady(false);
    setError(null);
    console.log('✅ Câmera parada com sucesso');
  }, [stream]);

  const capturePhoto = useCallback(() => {
    console.log('📸 === CAPTURANDO FOTO ===');
    
    if (!videoRef.current || !isReady) {
      console.error('❌ Video não está pronto para captura');
      toast({
        title: "Aguarde...",
        description: "A câmera ainda está carregando",
        variant: "destructive"
      });
      return null;
    }

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    console.log('📸 Dimensões do vídeo:', video.videoWidth, 'x', video.videoHeight);

    if (context && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      console.log('✅ Foto capturada com sucesso! Tamanho:', imageData.length, 'caracteres');
      return imageData;
    }

    console.error('❌ Falha na captura da foto');
    return null;
  }, [isReady, toast]);

  return {
    isActive,
    isLoading,
    isReady,
    error,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto
  };
};
