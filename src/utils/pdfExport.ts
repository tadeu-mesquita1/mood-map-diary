import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Entry {
  id: string;
  texto: string;
  emocao: string;
  created_at: string;
}

interface TimelineEvent {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  infancia: "Infância",
  adolescencia: "Adolescência",
  vida_adulta: "Vida Adulta",
  relacionamentos: "Relacionamentos",
  carreira: "Carreira",
  saude: "Saúde",
  outros: "Outros",
};

export const exportDiaryToPDF = (entries: Entry[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(207, 155, 44);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Diário de Autocuidado", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Exportado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 105, 30, { align: "center" });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  
  // Prepare data for table
  const tableData = entries.map((entry) => [
    format(new Date(entry.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    entry.emocao.charAt(0).toUpperCase() + entry.emocao.slice(1),
    entry.texto,
  ]);
  
  // Add table
  autoTable(doc, {
    startY: 50,
    head: [["Data/Hora", "Emoção", "Registro"]],
    body: tableData,
    headStyles: {
      fillColor: [207, 155, 44],
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 30 },
      2: { cellWidth: "auto" },
    },
    margin: { top: 50, left: 14, right: 14 },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Documento confidencial - Para uso profissional | Página ${i} de ${pageCount}`,
      105,
      285,
      { align: "center" }
    );
  }
  
  doc.save(`diario-autocuidado-${format(new Date(), "dd-MM-yyyy")}.pdf`);
};

export const exportTimelineToPDF = (events: TimelineEvent[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(207, 155, 44);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Linha do Tempo", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Exportado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 105, 30, { align: "center" });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  
  // Prepare data for table
  const tableData = events.map((event) => [
    format(new Date(event.created_at), "dd/MM/yyyy", { locale: ptBR }),
    CATEGORY_LABELS[event.categoria] || event.categoria,
    event.titulo,
    event.descricao,
  ]);
  
  // Add table
  autoTable(doc, {
    startY: 50,
    head: [["Data", "Categoria", "Título", "Descrição"]],
    body: tableData,
    headStyles: {
      fillColor: [207, 155, 44],
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: "auto" },
    },
    margin: { top: 50, left: 14, right: 14 },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Documento confidencial - Para uso profissional | Página ${i} de ${pageCount}`,
      105,
      285,
      { align: "center" }
    );
  }
  
  doc.save(`linha-do-tempo-${format(new Date(), "dd-MM-yyyy")}.pdf`);
};
