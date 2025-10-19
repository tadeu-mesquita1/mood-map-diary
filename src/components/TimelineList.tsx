import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CATEGORY_LABELS: Record<string, string> = {
  infancia: "Infância",
  adolescencia: "Adolescência",
  vida_adulta: "Vida Adulta",
  relacionamentos: "Relacionamentos",
  carreira: "Carreira",
  saude: "Saúde",
  outros: "Outros",
};

interface TimelineEvent {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  created_at: string;
}

interface TimelineListProps {
  userId: string;
}

const TimelineList = ({ userId }: TimelineListProps) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching timeline events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Listen for refresh events
    const handleRefresh = () => fetchEvents();
    window.addEventListener("refreshTimeline", handleRefresh);

    return () => window.removeEventListener("refreshTimeline", handleRefresh);
  }, [userId]);

  if (loading) {
    return <p className="text-center text-muted-foreground">Carregando eventos...</p>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum evento registrado ainda. Adicione momentos importantes da sua vida!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sua Linha do Tempo</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative pl-16">
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              
              <Card className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-lg">{event.titulo}</h4>
                      <Badge variant="outline" className="shrink-0">
                        {CATEGORY_LABELS[event.categoria]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.descricao}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Registrado em {format(new Date(event.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineList;
