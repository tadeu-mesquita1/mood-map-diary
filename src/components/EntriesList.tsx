import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Zap, Wind, Flame, PartyPopper, Moon, Sparkles, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { exportDiaryToPDF } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleExportPDF = () => {
    if (entries.length === 0) {
      toast({
        title: "Nenhum registro",
        description: "Não há registros para exportar.",
        variant: "destructive",
      });
      return;
    }
    
    exportDiaryToPDF(entries);
    toast({
      title: "PDF exportado!",
      description: "Seu diário foi exportado com sucesso.",
    });
  };

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Últimos Registros</h3>
        <Button onClick={handleExportPDF} className="w-full sm:w-auto" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
      {entries.map((entry) => {
        const emotionData = EMOTION_ICONS[entry.emocao];
        const Icon = emotionData?.icon || Smile;
        
        return (
          <Card key={entry.id} className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className={`p-2 rounded-full bg-muted ${emotionData?.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <Badge variant="secondary" className="capitalize w-fit">
                      {entry.emocao}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed break-words">{entry.texto}</p>
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
