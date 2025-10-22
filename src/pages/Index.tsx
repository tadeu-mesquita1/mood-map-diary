import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DailyEntryForm from "@/components/DailyEntryForm";
import EntriesList from "@/components/EntriesList";
import TimelineEventForm from "@/components/TimelineEventForm";
import TimelineList from "@/components/TimelineList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock } from "lucide-react";

const Index = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Create anonymous session
    const setupUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (data.user) {
          setUserId(data.user.id);
        }
      } else {
        setUserId(session.user.id);
      }
    };

    setupUser();
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Diário de Autocuidado</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <Tabs defaultValue="diario" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="diario" className="flex items-center gap-2 py-3">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="text-sm sm:text-base">Diário</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2 py-3">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-sm sm:text-base">Linha do Tempo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diario" className="space-y-4 sm:space-y-6 animate-fade-in">
            <DailyEntryForm userId={userId} />
            <EntriesList userId={userId} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4 sm:space-y-6 animate-fade-in">
            <TimelineEventForm userId={userId} />
            <TimelineList userId={userId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
