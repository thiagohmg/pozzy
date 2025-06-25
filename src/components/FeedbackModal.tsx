import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Upload, Send, X, Bug, Lightbulb, Heart, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const feedbackCategories = [
  {
    id: 'bug',
    name: 'Bug/Erro',
    description: 'Algo não está funcionando',
    icon: Bug,
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'feature',
    name: 'Nova Funcionalidade',
    description: 'Sugestão de melhoria',
    icon: Lightbulb,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'improvement',
    name: 'Melhoria',
    description: 'Melhorar algo existente',
    icon: Heart,
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    id: 'other',
    name: 'Outro',
    description: 'Outro tipo de feedback',
    icon: MessageSquare,
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  }
];

const priorityLevels = [
  { value: 'low', label: 'Baixa', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-700' }
];

export const FeedbackModal = ({ open, onOpenChange, trigger }: FeedbackModalProps) => {
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title || !description) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha categoria, título e descrição",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção, enviar para API real
      const feedbackData = {
        category,
        priority,
        title,
        description,
        email,
        screenshot: screenshot ? await fileToBase64(screenshot) : null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.log('Feedback enviado:', feedbackData);

      toast({
        title: "Feedback enviado! 🎉",
        description: "Obrigado por nos ajudar a melhorar o Pozzy. Vamos analisar sua sugestão!",
      });

      // Limpar formulário
      setCategory('');
      setPriority('medium');
      setTitle('');
      setDescription('');
      setEmail('');
      setScreenshot(null);
      onOpenChange(false);

    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshot(file);
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas imagens",
        variant: "destructive"
      });
    }
  };

  const selectedCategory = feedbackCategories.find(cat => cat.id === category);
  const selectedPriority = priorityLevels.find(level => level.value === priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <span>Envie seu Feedback</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categoria */}
          <div>
            <Label className="text-sm font-medium">Tipo de Feedback *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {feedbackCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${category === cat.id 
                        ? `${cat.color} border-current` 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-xs text-gray-600">{cat.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <Label className="text-sm font-medium">Prioridade</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center space-x-2">
                      <Badge className={level.color}>{level.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div>
            <Label className="text-sm font-medium">Título *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resumo do seu feedback"
              className="mt-2"
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1">
              {title.length}/100 caracteres
            </div>
          </div>

          {/* Descrição */}
          <div>
            <Label className="text-sm font-medium">Descrição *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente seu feedback, sugestão ou problema encontrado..."
              className="mt-2 min-h-[120px]"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {description.length}/1000 caracteres
            </div>
          </div>

          {/* Email (opcional) */}
          <div>
            <Label className="text-sm font-medium">Email (opcional)</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">
              Para receber atualizações sobre seu feedback
            </div>
          </div>

          {/* Screenshot */}
          <div>
            <Label className="text-sm font-medium">Screenshot (opcional)</Label>
            <div className="mt-2">
              {screenshot ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(screenshot)}
                    alt="Screenshot"
                    className="w-full max-w-md rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setScreenshot(null)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Clique para adicionar uma imagem
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('screenshot-input')?.click()}
                  >
                    Selecionar Imagem
                  </Button>
                  <input
                    id="screenshot-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resumo */}
          {category && title && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Resumo do Feedback</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Tipo:</span>
                  {selectedCategory && (
                    <Badge className={selectedCategory.color}>
                      {selectedCategory.name}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Prioridade:</span>
                  {selectedPriority && (
                    <Badge className={selectedPriority.color}>
                      {selectedPriority.label}
                    </Badge>
                  )}
                </div>
                <div>
                  <span className="text-gray-600">Título:</span>
                  <span className="ml-2">{title}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !category || !title || !description}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 