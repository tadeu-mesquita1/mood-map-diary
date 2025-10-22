import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Smile, Frown, Zap, Wind, Flame, PartyPopper, Moon, Sparkles } from "lucide-react";

const EMOTIONS = [
  { value: "feliz", label: "Feliz", icon: Smile, color: "text-yellow-500" },
  { value: "triste", label: "Triste", icon: Frown, color: "text-blue-500" },
  { value: "ansioso", label: "Ansioso", icon: Zap, color: "text-orange-500" },
  { value: "calmo", label: "Calmo", icon: Wind, color: "text-green-500" },
  { value: "irritado", label: "Irritado", icon: Flame, color: "text-red-500" },
  { value: "animado", label: "Animado", icon: PartyPopper, color: "text-pink-500" },
  { value: "cansado", label: "Cansado", icon: Moon, color: "text-indigo-500" },
  { value: "grato", label: "Grato", icon: Sparkles, color: "text-purple-500" },
];

interface DailyEntryFormProps {
  userId: string;
}

const DailyEntryForm = ({ userId }: DailyEntryFormProps) => {
  const [texto, setTexto] = useState("");
  const [emocao, setEmocao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!texto.trim() || !emocao) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("daily_entries").insert({
        user_id: userId,
        texto,
        emocao: emocao as "feliz" | "triste" | "ansioso" | "calmo" | "irritado" | "animado" | "cansado" | "grato",
      });

      if (error) throw error;

      toast.success("Registro salvo com sucesso!");
      setTexto("");
      setEmocao("");
      
      // Trigger refresh of entries list
      window.dispatchEvent(new CustomEvent("refreshEntries"));
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Como foi seu dia?</CardTitle>
        <CardDescription>
          Registre suas emoções e pensamentos do dia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="texto">O que você gostaria de compartilhar?</Label>
            <Textarea
              id="texto"
              placeholder="Escreva sobre seu dia, seus sentimentos, reflexões..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Como você está se sentindo?</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EMOTIONS.map((emotion) => {
                const Icon = emotion.icon;
                return (
                  <button
                    key={emotion.value}
                    type="button"
                    onClick={() => setEmocao(emotion.value)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      emocao === emotion.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${emotion.color}`} />
                    <p className="text-xs font-medium text-center">{emotion.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Registro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DailyEntryForm;
