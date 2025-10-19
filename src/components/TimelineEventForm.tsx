import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "infancia", label: "Infância" },
  { value: "adolescencia", label: "Adolescência" },
  { value: "vida_adulta", label: "Vida Adulta" },
  { value: "relacionamentos", label: "Relacionamentos" },
  { value: "carreira", label: "Carreira" },
  { value: "saude", label: "Saúde" },
  { value: "outros", label: "Outros" },
];

interface TimelineEventFormProps {
  userId: string;
}

const TimelineEventForm = ({ userId }: TimelineEventFormProps) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim() || !descricao.trim() || !categoria) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("timeline_events").insert([{
        user_id: userId,
        titulo,
        descricao,
        categoria,
      }]);

      if (error) throw error;

      toast.success("Evento adicionado à linha do tempo!");
      setTitulo("");
      setDescricao("");
      setCategoria("");
      
      // Trigger refresh of timeline list
      window.dispatchEvent(new CustomEvent("refreshTimeline"));
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Evento Importante</CardTitle>
        <CardDescription>
          Registre momentos marcantes da sua vida
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Evento</Label>
            <Input
              id="titulo"
              placeholder="Ex: Minha primeira viagem sozinho"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Conte sobre esse momento importante..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adicionando..." : "Adicionar à Linha do Tempo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TimelineEventForm;
