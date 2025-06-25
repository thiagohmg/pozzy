
import React from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Camera, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaletteDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectOption: (option: "camera" | "upload" | "saved") => void;
}

export const MobilePaletteDrawer = ({
  open,
  onClose,
  onSelectOption,
}: PaletteDrawerProps) => {
  // Cores da paleta do print
  const gradCamera = "from-[#4C1F4B] to-[#A883B7]";
  const gradUpload = "from-[#E8D5E8] to-[#A883B7]";
  const gradSaved = "from-[#E8D5E8] to-[#F3F0F3]";
  const iconsColor = "#4C1F4B";

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="pt-4 pb-8 px-4 rounded-t-2xl shadow-xl border-0">
        <div className="flex flex-col items-center">
          <div className="w-10 h-1.5 bg-[#ECE6EC] rounded-full mb-6" />
          <span className="mb-1 text-sm font-medium text-[#4C1F4B] tracking-wide">Como você quer começar?</span>
          <p className="text-xs text-[#6D5775] mb-5">Escolha uma forma de enviar sua foto abaixo</p>
        </div>

        <div className="space-y-3">
          <button
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-gradient-to-r ${gradCamera} text-white transition hover:brightness-110 shadow-none`}
            onClick={() => onSelectOption("camera")}
          >
            <Camera className="h-5 w-5" strokeWidth={2.2} color="#fff" />
            <div className="flex flex-col items-start text-left flex-1">
              <span className="font-semibold text-sm leading-tight">Tirar Foto Agora</span>
              <span className="text-xs opacity-85 font-normal">Use a câmera do seu celular</span>
            </div>
          </button>
          <button
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-gradient-to-r ${gradUpload} text-[#4C1F4B] transition hover:brightness-110 shadow-none`}
            onClick={() => onSelectOption("upload")}
          >
            <Upload className="h-5 w-5" strokeWidth={2.1} color={iconsColor} />
            <div className="flex flex-col items-start text-left flex-1">
              <span className="font-semibold text-sm leading-tight">Enviar da Galeria</span>
              <span className="text-xs opacity-85 font-normal">Escolha uma foto do seu dispositivo</span>
            </div>
          </button>
          <button
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-gradient-to-r ${gradSaved} text-[#4C1F4B] transition hover:brightness-110 shadow-none`}
            onClick={() => onSelectOption("saved")}
          >
            <Image className="h-5 w-5" strokeWidth={2.1} color={iconsColor} />
            <div className="flex flex-col items-start text-left flex-1">
              <span className="font-semibold text-sm leading-tight">Fotos Salvas</span>
              <span className="text-xs opacity-85 font-normal">Acesse e utilize fotos já salvas</span>
            </div>
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
