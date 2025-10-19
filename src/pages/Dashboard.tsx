import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Heart } from "lucide-react";
import { toast } from "sonner";
import DailyEntryForm from "@/components/DailyEntryForm";
import TimelineEventForm from "@/components/TimelineEventForm";
import EntriesList from "@/components/EntriesList";
import TimelineList from "@/components/TimelineList";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ apelido: string } | null>(null);

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("apelido")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Diário de Autocuidado</h1>
          </div>
          <div className="flex items-center gap-4">
            {profile && (
              <span className="text-sm text-muted-foreground">
                Olá, <span className="font-medium text-foreground">{profile.apelido}</span>
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="diario" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="diario">Diário</TabsTrigger>
            <TabsTrigger value="linha-tempo">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="diario" className="space-y-6">
            <DailyEntryForm userId={user?.id || ""} />
            <EntriesList userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="linha-tempo" className="space-y-6">
            <TimelineEventForm userId={user?.id || ""} />
            <TimelineList userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Em breve você poderá exportar todo seu histórico em PDF
              </p>
              <Button variant="secondary" disabled>
                Exportar PDF (em breve)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
