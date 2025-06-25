
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    image: string;
    styles: string[];
  }[];
}

interface StyleResult {
  name: string;
  description: string;
  characteristics: string[];
  colors: string[];
  recommendations: string[];
  icon: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual look você escolheria para um encontro especial?",
    options: [
      {
        id: "romantic",
        text: "Vestido floral delicado",
        image: "🌸",
        styles: ["romantic", "feminine"]
      },
      {
        id: "classic",
        text: "Blazer + calça social",
        image: "💼",
        styles: ["classic", "professional"]
      },
      {
        id: "boho",
        text: "Vestido longo estampado",
        image: "🌿",
        styles: ["boho", "free-spirit"]
      },
      {
        id: "modern",
        text: "Look monocromático minimalista",
        image: "⚫",
        styles: ["minimalist", "modern"]
      }
    ]
  },
  {
    id: 2,
    question: "Que tipo de acessório você mais usa?",
    options: [
      {
        id: "delicate",
        text: "Joias delicadas e discretas",
        image: "💎",
        styles: ["minimalist", "classic"]
      },
      {
        id: "statement",
        text: "Peças statement chamativas",
        image: "✨",
        styles: ["bold", "trendy"]
      },
      {
        id: "vintage",
        text: "Acessórios vintage únicos",
        image: "👜",
        styles: ["vintage", "boho"]
      },
      {
        id: "functional",
        text: "Acessórios práticos e funcionais",
        image: "⌚",
        styles: ["casual", "sporty"]
      }
    ]
  },
  {
    id: 3,
    question: "Sua cor favorita para roupas é:",
    options: [
      {
        id: "neutral",
        text: "Neutros (preto, branco, bege)",
        image: "⚪",
        styles: ["minimalist", "classic"]
      },
      {
        id: "earth",
        text: "Tons terrosos (marrom, verde, mostarda)",
        image: "🟤",
        styles: ["boho", "natural"]
      },
      {
        id: "pastels",
        text: "Cores pastéis (rosa, azul claro)",
        image: "🌸",
        styles: ["romantic", "feminine"]
      },
      {
        id: "bold",
        text: "Cores vibrantes (vermelho, azul royal)",
        image: "🔴",
        styles: ["bold", "dramatic"]
      }
    ]
  },
  {
    id: 4,
    question: "Seu sapato preferido para o dia a dia:",
    options: [
      {
        id: "heels",
        text: "Salto alto elegante",
        image: "👠",
        styles: ["feminine", "classic"]
      },
      {
        id: "flats",
        text: "Sapatilha confortável",
        image: "🥿",
        styles: ["casual", "practical"]
      },
      {
        id: "boots",
        text: "Bota estilosa",
        image: "👢",
        styles: ["boho", "edgy"]
      },
      {
        id: "sneakers",
        text: "Tênis fashion",
        image: "👟",
        styles: ["sporty", "modern"]
      }
    ]
  },
  {
    id: 5,
    question: "Para uma festa, você prefere:",
    options: [
      {
        id: "glamorous",
        text: "Vestido de festa glamouroso",
        image: "✨",
        styles: ["glamorous", "dramatic"]
      },
      {
        id: "chic",
        text: "Look chique e sofisticado",
        image: "🖤",
        styles: ["classic", "sophisticated"]
      },
      {
        id: "playful",
        text: "Algo divertido e colorido",
        image: "🌈",
        styles: ["playful", "trendy"]
      },
      {
        id: "unique",
        text: "Peça única e diferente",
        image: "🦄",
        styles: ["vintage", "eclectic"]
      }
    ]
  }
];

const styleResults: { [key: string]: StyleResult } = {
  minimalist: {
    name: "Minimalista Chique",
    description: "Você ama a simplicidade elegante e peças atemporais",
    characteristics: ["Clean", "Atemporal", "Funcional", "Neutro"],
    colors: ["Preto", "Branco", "Cinza", "Bege", "Camel"],
    recommendations: ["Blazers estruturados", "Calças alfaiataria", "Vestidos midi", "Casacos longos"],
    icon: "⚫"
  },
  romantic: {
    name: "Romântica Feminina",
    description: "Você adora peças delicadas que realçam sua feminilidade",
    characteristics: ["Delicada", "Feminina", "Suave", "Floral"],
    colors: ["Rosa", "Nude", "Lavanda", "Pêssego", "Branco"],
    recommendations: ["Vestidos florais", "Blusas de renda", "Saias midi", "Cardigans"],
    icon: "🌸"
  },
  boho: {
    name: "Boho Free Spirit",
    description: "Seu estilo é livre, criativo e conectado com a natureza",
    characteristics: ["Livre", "Criativa", "Natural", "Única"],
    colors: ["Mostarda", "Verde oliva", "Terracota", "Burgundy", "Caramelo"],
    recommendations: ["Vestidos longos", "Kaftans", "Acessórios étnicos", "Camadas"],
    icon: "🌿"
  },
  classic: {
    name: "Clássica Elegante",
    description: "Você preza pela elegância atemporal e sofisticação",
    characteristics: ["Elegante", "Sofisticada", "Atemporal", "Refinada"],
    colors: ["Navy", "Preto", "Branco", "Vermelho", "Camel"],
    recommendations: ["Trench coat", "Blazers", "Pérolas", "Scarfs de seda"],
    icon: "💼"
  },
  trendy: {
    name: "Trendsetter Moderna",
    description: "Você está sempre por dentro das últimas tendências",
    characteristics: ["Moderna", "Ousada", "Atual", "Inovadora"],
    colors: ["Cores da temporada", "Neon", "Metálicos", "Padrões bold"],
    recommendations: ["Peças statement", "Acessórios chamativos", "Combinações ousadas"],
    icon: "✨"
  }
};

export const StyleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<StyleResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (userAnswers: string[]) => {
    const styleScores: { [key: string]: number } = {};

    // Contar os estilos baseado nas respostas
    userAnswers.forEach(answerId => {
      quizQuestions.forEach(question => {
        const option = question.options.find(opt => opt.id === answerId);
        if (option) {
          option.styles.forEach(style => {
            styleScores[style] = (styleScores[style] || 0) + 1;
          });
        }
      });
    });

    // Encontrar o estilo dominante
    const dominantStyle = Object.keys(styleScores).reduce((a, b) => 
      styleScores[a] > styleScores[b] ? a : b
    );

    const styleResult = styleResults[dominantStyle] || styleResults.classic;
    setResult(styleResult);
    setIsCompleted(true);

    toast({
      title: "Quiz completo! ✨",
      description: `Seu estilo é ${styleResult.name}!`
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setIsCompleted(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isCompleted && result) {
    return (
      <div className="space-y-6">
        <Card className="border-purple-200">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">{result.icon}</div>
            <CardTitle className="text-2xl text-purple-600">
              Seu Estilo: {result.name}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {result.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Características */}
            <div>
              <h3 className="font-medium mb-2">Suas Características:</h3>
              <div className="flex flex-wrap gap-2">
                {result.characteristics.map(char => (
                  <Badge key={char} variant="secondary">{char}</Badge>
                ))}
              </div>
            </div>

            {/* Paleta de Cores */}
            <div>
              <h3 className="font-medium mb-2">Suas Cores:</h3>
              <div className="flex flex-wrap gap-2">
                {result.colors.map(color => (
                  <Badge key={color} className="bg-purple-100 text-purple-700">{color}</Badge>
                ))}
              </div>
            </div>

            {/* Recomendações */}
            <div>
              <h3 className="font-medium mb-2">Recomendações para Você:</h3>
              <ul className="space-y-1">
                {result.recommendations.map(rec => (
                  <li key={rec} className="text-sm flex items-center space-x-2">
                    <ArrowRight className="h-3 w-3 text-purple-500" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Refazer Quiz
              </Button>
              <Button className="flex-1 bg-purple-500 hover:bg-purple-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Ver Produtos do Meu Estilo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Descubra Seu Estilo ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Responda algumas perguntas e descubra qual é o seu estilo pessoal
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {quizQuestions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {quizQuestions[currentQuestion].options.map(option => (
              <Button
                key={option.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
                onClick={() => handleAnswer(option.id)}
              >
                <div className="text-2xl">{option.image}</div>
                <span className="text-center">{option.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
