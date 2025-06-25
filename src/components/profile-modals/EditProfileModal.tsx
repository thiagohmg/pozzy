import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProfileData } from "@/hooks/useProfileData";
import { useLanguage, LANGUAGES, type Language } from "@/hooks/useLanguage";
import { Globe, Check } from "lucide-react";

// Adicione a prop userId para saber de quem é o perfil
interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onOpenChange,
  userId,
}) => {
  const { toast } = useToast();
  const { profile, loading, error, updateProfile } = useProfileData(userId);
  const { currentLanguage, changeLanguage, t, getCurrentLanguage } = useLanguage();

  // Estados locais de edição
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [saving, setSaving] = useState(false);

  // Detecta se é mobile
  const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    setAvatarUrl(profile?.avatar_url || "");
    setAvatarFile(null);
    setSelectedLanguage(currentLanguage);
  }, [profile, open, currentLanguage]); // Recarrega ao abrir

  // Upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarFile(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Câmera
  const handleStartCamera = () => {
    setShowCamera(true);
    setIsCameraActive(true);
  };

  useEffect(() => {
    if (showCamera && videoRef.current) {
      (async () => {
        try {
          let stream;
          if (isMobile) {
            // No mobile, tenta o mais simples
            try {
              stream = await navigator.mediaDevices.getUserMedia({ video: true });
              if (videoRef.current) videoRef.current.srcObject = stream;
              return;
            } catch {}
            // fallback para desktop
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            if (videoRef.current) videoRef.current.srcObject = stream;
          } else {
            // No desktop, tenta frontal primeiro
            try {
              stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
              if (videoRef.current) videoRef.current.srcObject = stream;
              return;
            } catch {}
            // fallback para qualquer câmera
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
          }
        } catch (err) {
          toast({
            title: "Câmera não disponível",
            description: "Para tirar uma foto, acesse pelo seu celular ou use um navegador compatível.",
            variant: "destructive"
          });
          setShowCamera(false);
          setIsCameraActive(false);
        }
      })();
    }
    // Limpeza ao fechar câmera
    if (!showCamera && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [showCamera]);

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setAvatarFile(dataUrl);
      handleStopCamera();
    }
  };

  const handleStopCamera = () => {
    setShowCamera(false);
    setIsCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Atualizar idioma se mudou
    if (selectedLanguage !== currentLanguage) {
      changeLanguage(selectedLanguage);
      toast({
        title: t('language_updated'),
        description: t('language_updated_description'),
      });
    }
    
    const finalAvatar = avatarFile || avatarUrl;
    // Só atualiza a foto
    const ok = await updateProfile(undefined, finalAvatar);
    setSaving(false);
    if (ok) {
      toast({
        title: t('photo_updated'),
        description: t('photo_updated_description'),
      });
      onOpenChange(false);
    } else {
      toast({
        title: t('update_error'),
        description: t('update_error_description'),
        variant: "destructive",
      });
    }
  };

  const currentLang = getCurrentLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit_profile')}</DialogTitle>
          <DialogDescription>
            {t('profile_description')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* Seção de Foto */}
          <div className="flex items-center gap-4 mb-2">
            {(avatarFile || avatarUrl) ? (
              <img
                src={avatarFile || avatarUrl}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap">Sem foto</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer text-sm bg-purple-600 text-white px-3 py-1 rounded shadow hover:bg-purple-700">
                Upload
            <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                className="text-sm bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700"
                onClick={handleStartCamera}
                disabled={isCameraActive}
              >
                Tirar Foto
              </button>
            </div>
          </div>
          
          {showCamera && (
            <div className="mb-2">
              <video ref={videoRef} autoPlay className="w-40 h-40 rounded-lg border mb-2" />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={handleCapturePhoto}
                >
                  Capturar
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  onClick={handleStopCamera}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Informações do Usuário */}
          <div>
            <div className="mb-1 text-sm text-gray-600">{t('name')}</div>
            <div className="font-medium text-gray-900">{profile?.full_name || "-"}</div>
          </div>

          {/* Seção de Idioma */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">{t('language')}</div>
                <div className="text-sm text-gray-600">{t('language_description')}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {LANGUAGES.map((language) => (
                <div
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedLanguage === language.code 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">{language.nativeName}</div>
                      <div className="text-sm text-gray-600">{language.name}</div>
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              ))}
            </div>

            {/* Dica sobre idiomas */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Globe className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">🌍 Sistema Global</p>
                  <p className="text-xs text-blue-600">
                    O Pozzy é usado por milhares de pessoas no mundo. Escolha o idioma que preferir!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
          <Button type="submit" className="w-full" disabled={saving || loading}>
              {saving ? t('saving') : t('save_photo')}
          </Button>
        </form>
        </div>
        {error && (
          <div className="text-red-500 text-xs py-2">{error}</div>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="w-full">{t('close')}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
