import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Clock, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Diário Digital de Autocuidado
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Um espaço seguro para registrar suas emoções, reflexões e momentos importantes. 
            Sua jornada de autoconhecimento começa aqui.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
              Já tenho conta
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Diário Emocional</h3>
            <p className="text-muted-foreground">
              Registre como você se sente a cada dia e acompanhe sua evolução emocional
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Linha do Tempo</h3>
            <p className="text-muted-foreground">
              Organize eventos importantes da sua vida por categorias e períodos
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Exportação</h3>
            <p className="text-muted-foreground">
              Exporte seus registros em PDF para compartilhar com profissionais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
