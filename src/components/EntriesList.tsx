import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Zap, Wind, Flame, PartyPopper, Moon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const EMOTION_ICONS: Record<string, any> = {
  feliz: { icon: Smile, color: "text-yellow-500" },
  triste: { icon: Frown, color: "text-blue-500" },
  ansioso: { icon: Zap, color: "text-orange-500" },
  calmo: { icon: Wind, color: "text-green-500" },
  irritado: { icon: Flame, color: "text-red-500" },
  animado: { icon: PartyPopper, color: "text-pink-500" },
  cansado: { icon: Moon, color: "text-indigo-500" },
  grato: { icon: Sparkles, color: "text-purple-500" },
};

interface Entry {
  id: string;
  texto: string;
  emocao: string;
  created_at: string;
}

interface EntriesListProps {
  userId: string;
}

const EntriesList = ({ userId }: EntriesListProps) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();

    // Listen for refresh events
    const handleRefresh = () => fetchEntries();
    window.addEventListener("refreshEntries", handleRefresh);

    return () => window.removeEventListener("refreshEntries", handleRefresh);
  }, [userId]);

  if (loading) {
    return <p className="text-center text-muted-foreground">Carregando registros...</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum registro ainda. Comece escrevendo sobre seu dia!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Últimos Registros</h3>
      {entries.map((entry) => {
        const emotionData = EMOTION_ICONS[entry.emocao];
        const Icon = emotionData?.icon || Smile;
        
        return (
          <Card key={entry.id} className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-muted ${emotionData?.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {entry.emocao}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{entry.texto}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EntriesList;
