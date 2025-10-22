# 📖 Documentação - Diário de Autocuidado

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Banco de Dados](#banco-de-dados)
6. [Componentes](#componentes)
7. [Funcionalidades](#funcionalidades)
8. [Guia de Instalação](#guia-de-instalação)
9. [Como Usar](#como-usar)
10. [Exportação de PDF](#exportação-de-pdf)
11. [Responsividade Mobile](#responsividade-mobile)

---

## 🎯 Visão Geral

O **Diário de Autocuidado** é uma aplicação web simples e intuitiva para registro de emoções diárias e eventos importantes da vida. Foi projetado especificamente para facilitar o acompanhamento terapêutico, permitindo que o usuário exporte seus registros em PDF para compartilhar com profissionais de saúde mental.

### Objetivos Principais
- ✅ Registrar emoções e pensamentos diários
- ✅ Criar uma linha do tempo de eventos importantes
- ✅ Exportar dados em PDF formatado
- ✅ Interface simples e acessível
- ✅ Funcionamento em dispositivos móveis

---

## 🏗️ Arquitetura do Projeto

### Modelo de Arquitetura
```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│                                         │
│  ┌─────────────┐      ┌──────────────┐ │
│  │   Páginas   │      │ Componentes  │ │
│  └─────────────┘      └──────────────┘ │
│           │                  │          │
│           └──────────┬───────┘          │
│                      ▼                  │
│            ┌──────────────────┐         │
│            │  Supabase Client │         │
│            └──────────────────┘         │
└─────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│      Backend (Lovable Cloud/Supabase)  │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │  Auth    │  │ Database │  │  RLS  ││
│  │ Anonymous│  │PostgreSQL│  │Policies││
│  └──────────┘  └──────────┘  └───────┘│
└─────────────────────────────────────────┘
```

### Fluxo de Dados
1. **Usuário acessa** → Sistema cria sessão anônima automaticamente
2. **Usuário registra** → Dados salvos no Supabase com `user_id`
3. **Visualização** → Dados carregados filtrados por `user_id`
4. **Exportação** → PDF gerado no lado do cliente com jsPDF

---

## 💻 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 18.3.1 | Framework principal |
| **TypeScript** | 5.x | Tipagem estática |
| **Vite** | 5.x | Build tool |
| **Tailwind CSS** | 3.x | Estilização |
| **Shadcn UI** | - | Componentes UI |
| **date-fns** | 4.1.0 | Formatação de datas |
| **jsPDF** | latest | Geração de PDF |
| **jspdf-autotable** | latest | Tabelas em PDF |

### Backend
| Tecnologia | Uso |
|-----------|-----|
| **Supabase** | Banco de dados PostgreSQL |
| **Row Level Security (RLS)** | Segurança de dados |
| **Auth Anonymous** | Autenticação simplificada |

### Ícones e UI
- **Lucide React**: Biblioteca de ícones
- **Radix UI**: Componentes acessíveis base

---

## 📁 Estrutura de Pastas

```
projeto/
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes base do Shadcn
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   └── toast.tsx
│   │   ├── DailyEntryForm.tsx     # Formulário de registro diário
│   │   ├── EntriesList.tsx        # Lista de registros diários
│   │   ├── TimelineEventForm.tsx  # Formulário de eventos
│   │   └── TimelineList.tsx       # Lista de eventos da linha do tempo
│   ├── pages/
│   │   ├── Index.tsx              # Página principal
│   │   └── NotFound.tsx           # Página 404
│   ├── utils/
│   │   └── pdfExport.ts           # Funções de exportação PDF
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Cliente Supabase
│   │       └── types.ts           # Tipos TypeScript gerados
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Hook para detectar mobile
│   │   └── use-toast.ts           # Hook para notificações
│   ├── lib/
│   │   └── utils.ts               # Funções utilitárias
│   ├── App.tsx                    # Componente raiz com rotas
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Estilos globais + tema
├── supabase/
│   ├── config.toml                # Configuração Supabase
│   └── migrations/                # Migrações de banco de dados
├── index.html
├── package.json
├── tailwind.config.ts             # Configuração Tailwind
├── tsconfig.json                  # Configuração TypeScript
├── vite.config.ts                 # Configuração Vite
└── DOCUMENTACAO.md               # Este arquivo
```

---

## 🗄️ Banco de Dados

### Schema do Banco de Dados

#### Tabela: `daily_entries`
Armazena os registros diários de emoções.

```sql
CREATE TABLE daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  texto TEXT NOT NULL,
  emocao emotion_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | ID do usuário (sessão anônima) |
| `texto` | TEXT | Conteúdo do registro |
| `emocao` | ENUM | Emoção selecionada |
| `created_at` | TIMESTAMP | Data/hora de criação |
| `updated_at` | TIMESTAMP | Data/hora de atualização |

**Emoções disponíveis:**
- `feliz` 😊
- `triste` 😢
- `ansioso` ⚡
- `calmo` 🌊
- `irritado` 🔥
- `animado` 🎉
- `cansado` 🌙
- `grato` ✨

#### Tabela: `timeline_events`
Armazena eventos importantes da linha do tempo.

```sql
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria timeline_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | ID do usuário |
| `titulo` | TEXT | Título do evento |
| `descricao` | TEXT | Descrição detalhada |
| `categoria` | ENUM | Categoria do evento |
| `created_at` | TIMESTAMP | Data/hora de criação |
| `updated_at` | TIMESTAMP | Data/hora de atualização |

**Categorias disponíveis:**
- `infancia` - Infância
- `adolescencia` - Adolescência
- `vida_adulta` - Vida Adulta
- `relacionamentos` - Relacionamentos
- `carreira` - Carreira
- `saude` - Saúde
- `outros` - Outros

#### Tabela: `profiles`
Armazena perfis dos usuários (para uso futuro).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  apelido TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Políticas de Segurança (RLS)

Todas as tabelas possuem Row Level Security (RLS) ativado:

```sql
-- Exemplo para daily_entries
CREATE POLICY "Users can view their own entries"
  ON daily_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries"
  ON daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON daily_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON daily_entries FOR DELETE
  USING (auth.uid() = user_id);
```

**Importante:** As políticas garantem que cada usuário só acessa seus próprios dados.

---

## 🧩 Componentes

### 1. `Index.tsx` - Página Principal
**Localização:** `src/pages/Index.tsx`

**Responsabilidades:**
- Criar sessão anônima automaticamente
- Gerenciar estado do `userId`
- Renderizar abas (Diário / Linha do Tempo)
- Coordenar os formulários e listas

**Props:** Nenhuma

**Estados:**
```typescript
const [userId, setUserId] = useState<string>("");
```

**Fluxo:**
```typescript
useEffect(() => {
  // 1. Verificar sessão existente
  const { data: { session } } = await supabase.auth.getSession();
  
  // 2. Se não existir, criar sessão anônima
  if (!session) {
    const { data } = await supabase.auth.signInAnonymously();
    setUserId(data.user.id);
  } else {
    setUserId(session.user.id);
  }
}, []);
```

---

### 2. `DailyEntryForm.tsx` - Formulário de Registro Diário
**Localização:** `src/components/DailyEntryForm.tsx`

**Responsabilidades:**
- Coletar texto do dia
- Selecionar emoção
- Salvar no banco de dados
- Limpar formulário após envio

**Props:**
```typescript
interface DailyEntryFormProps {
  userId: string;
}
```

**Estados:**
```typescript
const [texto, setTexto] = useState("");
const [emocao, setEmocao] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Validações:**
- Texto não pode estar vazio
- Emoção deve ser selecionada
- Desabilita botão durante envio

**Emoções disponíveis no Select:**
```typescript
const emocoes = [
  { value: "feliz", label: "😊 Feliz" },
  { value: "triste", label: "😢 Triste" },
  { value: "ansioso", label: "⚡ Ansioso" },
  { value: "calmo", label: "🌊 Calmo" },
  { value: "irritado", label: "🔥 Irritado" },
  { value: "animado", label: "🎉 Animado" },
  { value: "cansado", label: "🌙 Cansado" },
  { value: "grato", label: "✨ Grato" }
];
```

---

### 3. `EntriesList.tsx` - Lista de Registros Diários
**Localização:** `src/components/EntriesList.tsx`

**Responsabilidades:**
- Buscar registros do banco de dados
- Exibir lista ordenada por data (mais recentes primeiro)
- Mostrar emoções com ícones coloridos
- Botão de exportar PDF

**Props:**
```typescript
interface EntriesListProps {
  userId: string;
}
```

**Estados:**
```typescript
const [entries, setEntries] = useState<Entry[]>([]);
const [loading, setLoading] = useState(true);
```

**Mapeamento de Ícones:**
```typescript
const EMOTION_ICONS: Record<string, any> = {
  feliz: { icon: Smile, color: "text-yellow-500" },
  triste: { icon: Frown, color: "text-blue-500" },
  ansioso: { icon: Zap, color: "text-orange-500" },
  // ... outros
};
```

**Query Supabase:**
```typescript
const { data } = await supabase
  .from("daily_entries")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false })
  .limit(10);
```

**Atualização Automática:**
- Escuta evento customizado `refreshEntries`
- Recarrega dados quando novo registro é criado

---

### 4. `TimelineEventForm.tsx` - Formulário de Eventos
**Localização:** `src/components/TimelineEventForm.tsx`

**Responsabilidades:**
- Coletar título do evento
- Coletar descrição
- Selecionar categoria
- Salvar evento no banco

**Props:**
```typescript
interface TimelineEventFormProps {
  userId: string;
}
```

**Estados:**
```typescript
const [titulo, setTitulo] = useState("");
const [descricao, setDescricao] = useState("");
const [categoria, setCategoria] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Categorias disponíveis:**
```typescript
const categorias = [
  { value: "infancia", label: "Infância" },
  { value: "adolescencia", label: "Adolescência" },
  { value: "vida_adulta", label: "Vida Adulta" },
  { value: "relacionamentos", label: "Relacionamentos" },
  { value: "carreira", label: "Carreira" },
  { value: "saude", label: "Saúde" },
  { value: "outros", label: "Outros" }
];
```

---

### 5. `TimelineList.tsx` - Lista de Eventos da Linha do Tempo
**Localização:** `src/components/TimelineList.tsx`

**Responsabilidades:**
- Buscar eventos do banco de dados
- Exibir linha do tempo visual
- Mostrar categorias com badges
- Botão de exportar PDF

**Props:**
```typescript
interface TimelineListProps {
  userId: string;
}
```

**Características Visuais:**
- Linha vertical conectando eventos (desktop)
- Pontos circulares para cada evento
- Layout responsivo (sem linha no mobile)
- Cards com hover effect

---

## ⚙️ Funcionalidades

### 1. Autenticação Anônima Automática
```typescript
// src/pages/Index.tsx
useEffect(() => {
  const setupUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const { data } = await supabase.auth.signInAnonymously();
      setUserId(data.user.id);
    } else {
      setUserId(session.user.id);
    }
  };
  
  setupUser();
}, []);
```

**Vantagens:**
- ✅ Sem necessidade de cadastro
- ✅ Dados isolados por sessão
- ✅ Experiência simplificada

---

### 2. Registro de Emoções Diárias

**Fluxo completo:**

1. **Usuário preenche formulário:**
   ```typescript
   <Textarea 
     value={texto}
     onChange={(e) => setTexto(e.target.value)}
     placeholder="Como foi seu dia?"
   />
   
   <Select 
     value={emocao}
     onValueChange={setEmocao}
   >
     {/* Opções de emoções */}
   </Select>
   ```

2. **Sistema valida:**
   ```typescript
   if (!texto.trim() || !emocao) {
     toast({
       title: "Campos obrigatórios",
       variant: "destructive"
     });
     return;
   }
   ```

3. **Salva no banco:**
   ```typescript
   const { error } = await supabase
     .from("daily_entries")
     .insert({ 
       user_id: userId, 
       texto, 
       emocao: emocao as Database["public"]["Enums"]["emotion_type"]
     });
   ```

4. **Atualiza lista:**
   ```typescript
   window.dispatchEvent(new Event("refreshEntries"));
   ```

---

### 3. Linha do Tempo de Eventos

**Diferença do Diário:**
- Foco em eventos marcantes, não diários
- Possui categorização
- Título + Descrição separados
- Visualização cronológica

**Estrutura de dados:**
```typescript
interface TimelineEvent {
  id: string;
  titulo: string;
  descricao: string;
  categoria: timeline_category;
  created_at: string;
}
```

---

## 📄 Exportação de PDF

### Arquivo: `src/utils/pdfExport.ts`

#### Função: `exportDiaryToPDF(entries: Entry[])`

**Estrutura do PDF:**

1. **Cabeçalho:**
   - Fundo colorido (#cf9b2c)
   - Título: "Diário de Autocuidado"
   - Data de exportação

2. **Tabela de Registros:**
   ```typescript
   autoTable(doc, {
     head: [["Data/Hora", "Emoção", "Registro"]],
     body: tableData,
     headStyles: {
       fillColor: [207, 155, 44], // Cor dourada
       textColor: [255, 255, 255]
     }
   });
   ```

3. **Rodapé:**
   - Texto: "Documento confidencial - Para uso profissional"
   - Numeração de páginas

**Uso:**
```typescript
import { exportDiaryToPDF } from "@/utils/pdfExport";

const handleExportPDF = () => {
  exportDiaryToPDF(entries);
  toast({
    title: "PDF exportado!",
    description: "Seu diário foi exportado com sucesso."
  });
};
```

---

#### Função: `exportTimelineToPDF(events: TimelineEvent[])`

**Estrutura do PDF:**

Similar ao diário, mas com colunas diferentes:

```typescript
head: [["Data", "Categoria", "Título", "Descrição"]]
```

**Formatação de categorias:**
```typescript
const CATEGORY_LABELS: Record<string, string> = {
  infancia: "Infância",
  adolescencia: "Adolescência",
  // ... outros
};
```

**Nome do arquivo:**
```typescript
doc.save(`linha-do-tempo-${format(new Date(), "dd-MM-yyyy")}.pdf`);
```

---

## 📱 Responsividade Mobile

### Estratégia de Design Responsivo

#### 1. Sistema de Breakpoints (Tailwind)
```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Smartphones landscape e tablets portrait
  'md': '768px',   // Tablets
  'lg': '1024px',  // Desktops
  'xl': '1280px'   // Desktops grandes
}
```

#### 2. Classes Responsivas Aplicadas

**Container principal:**
```tsx
<div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
```
- Mobile: padding 4 (16px), py 6 (24px)
- Desktop: padding mantém, py aumenta para 8 (32px)

**Tabs:**
```tsx
<TabsList className="grid w-full grid-cols-2 h-auto">
  <TabsTrigger className="flex items-center gap-2 py-3">
    <BookOpen className="w-4 h-4 shrink-0" />
    <span className="text-sm sm:text-base">Diário</span>
  </TabsTrigger>
</TabsList>
```
- Ícones com `shrink-0` (não encolhem)
- Texto menor em mobile (`text-sm`), normal em desktop (`sm:text-base`)
- Altura automática para acomodar conteúdo

**Cards de registros:**
```tsx
<div className="flex flex-col sm:flex-row items-start gap-3">
  <div className="p-2 rounded-full bg-muted shrink-0">
    <Icon className="w-5 h-5" />
  </div>
  <div className="flex-1 space-y-2 min-w-0">
    <p className="text-sm leading-relaxed break-words">{texto}</p>
  </div>
</div>
```
- Mobile: Layout vertical (`flex-col`)
- Desktop: Layout horizontal (`sm:flex-row`)
- `min-w-0` previne overflow de texto
- `break-words` quebra palavras longas

**Botões de exportar:**
```tsx
<Button className="w-full sm:w-auto" size="sm">
  <Download className="w-4 h-4 mr-2" />
  Exportar PDF
</Button>
```
- Mobile: Largura total (`w-full`)
- Desktop: Largura automática (`sm:w-auto`)

**Linha do tempo:**
```tsx
<div className="hidden sm:block absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
<div className="relative sm:pl-16">
  <div className="hidden sm:block absolute left-6 top-6 w-4 h-4 rounded-full bg-primary" />
</div>
```
- Mobile: Linha e dots escondidos (`hidden`)
- Desktop: Visíveis (`sm:block`)
- Padding lateral apenas no desktop (`sm:pl-16`)

#### 3. Hook `use-mobile.tsx`

```typescript
import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};
```

**Uso:**
```typescript
const isMobile = useIsMobile();

// Exemplo de uso condicional
{isMobile ? <MobileLayout /> : <DesktopLayout />}
```

#### 4. Viewport Meta Tag

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Importante para:**
- Escala correta em dispositivos móveis
- Previne zoom indesejado
- Largura correta do viewport

---

### Testes de Responsividade

#### Breakpoints a testar:
- 📱 **320px** - iPhone SE (menor)
- 📱 **375px** - iPhone padrão
- 📱 **414px** - iPhone Plus
- 📱 **768px** - iPad portrait
- 💻 **1024px** - iPad landscape / Desktop
- 💻 **1280px+** - Desktop grande

#### Checklist de testes:
- [ ] Tabs visíveis e clicáveis
- [ ] Formulários preenchem toda largura
- [ ] Botões "Exportar PDF" acessíveis
- [ ] Cards não quebram layout
- [ ] Textos longos quebram corretamente
- [ ] Linha do tempo oculta em mobile
- [ ] Badges não quebram linha
- [ ] Toast notifications visíveis

---

## 🚀 Guia de Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Conta Lovable (para deploy)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone [URL_DO_REPOSITORIO]
cd diario-autocuidado
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. **Execute o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse no navegador:**
```
http://localhost:5173
```

### Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "vite",                    // Desenvolvimento
    "build": "tsc && vite build",     // Build de produção
    "preview": "vite preview",        // Preview do build
    "lint": "eslint . --ext ts,tsx"   // Linting
  }
}
```

---

## 📖 Como Usar

### 1. Primeiro Acesso

Ao acessar o aplicativo:
1. Uma sessão anônima é criada automaticamente
2. Você verá a mensagem "Carregando..." brevemente
3. O aplicativo carrega na aba "Diário"

### 2. Registrando Emoções Diárias

**Aba "Diário":**

1. Digite no campo de texto como foi seu dia
2. Selecione uma emoção que representa seu estado
3. Clique em "Salvar Registro"
4. O registro aparece instantaneamente na lista abaixo

**Exemplo:**
```
Texto: "Hoje foi um dia produtivo, consegui terminar o projeto."
Emoção: 😊 Feliz
```

### 3. Criando Linha do Tempo

**Aba "Linha do Tempo":**

1. Digite um título para o evento importante
2. Descreva o evento em detalhes
3. Selecione uma categoria que melhor se encaixa
4. Clique em "Adicionar Evento"

**Exemplo:**
```
Título: "Formatura na Universidade"
Descrição: "Conclui minha graduação em Psicologia após 5 anos de estudos."
Categoria: Carreira
```

### 4. Exportando para PDF

**Para exportar o Diário:**
1. Vá para a aba "Diário"
2. Role até a seção "Últimos Registros"
3. Clique no botão "Exportar PDF"
4. O arquivo será baixado automaticamente

**Para exportar a Linha do Tempo:**
1. Vá para a aba "Linha do Tempo"
2. Role até a seção "Sua Linha do Tempo"
3. Clique no botão "Exportar PDF"
4. O arquivo será baixado automaticamente

**Nome dos arquivos:**
- Diário: `diario-autocuidado-DD-MM-YYYY.pdf`
- Linha do Tempo: `linha-do-tempo-DD-MM-YYYY.pdf`

### 5. Compartilhando com Profissional

**Fluxo recomendado:**

1. Acumule registros ao longo do tempo
2. Antes da consulta, exporte ambos os PDFs
3. Envie os PDFs por e-mail ou leve impresso
4. O profissional terá uma visão completa organizada

**Informações nos PDFs:**
- ✅ Data e hora exatas de cada registro
- ✅ Emoções categorizadas
- ✅ Textos completos
- ✅ Categorização de eventos
- ✅ Formato profissional e legível

---

## 🎨 Personalização

### Cores do Tema

Edite `src/index.css`:

```css
:root {
  --primary: 40 85% 55%;        /* #cf9b2c - Dourado */
  --primary-foreground: 40 98% 95%;
  --secondary: 40 95% 75%;      /* #f3bf4f - Dourado claro */
  /* ... outras cores */
}
```

### Adicionar Nova Emoção

1. **Adicione no enum do banco de dados:**
```sql
ALTER TYPE emotion_type ADD VALUE 'nova_emocao';
```

2. **Atualize o formulário:**
```typescript
// DailyEntryForm.tsx
{ value: "nova_emocao", label: "🙂 Nova Emoção" }
```

3. **Adicione o ícone:**
```typescript
// EntriesList.tsx
const EMOTION_ICONS = {
  // ...
  nova_emocao: { icon: Smile, color: "text-green-500" }
};
```

### Adicionar Nova Categoria

1. **Adicione no enum do banco:**
```sql
ALTER TYPE timeline_category ADD VALUE 'nova_categoria';
```

2. **Atualize o formulário:**
```typescript
// TimelineEventForm.tsx
{ value: "nova_categoria", label: "Nova Categoria" }
```

3. **Atualize o mapeamento:**
```typescript
// TimelineList.tsx
const CATEGORY_LABELS = {
  // ...
  nova_categoria: "Nova Categoria"
};
```

---

## 🔒 Segurança e Privacidade

### Row Level Security (RLS)

Todas as tabelas têm RLS ativado, garantindo que:
- ✅ Usuários só veem seus próprios dados
- ✅ Impossível acessar dados de outros usuários
- ✅ Todas as operações são filtradas por `user_id`

### Autenticação Anônima

**Vantagens:**
- Não requer dados pessoais
- Sessão persistente no navegador
- Dados isolados por sessão

**Limitações:**
- Dados perdidos se limpar o navegador
- Sem recuperação de conta
- Não sincroniza entre dispositivos

**Solução futura:**
Para persistência real, considere implementar:
- Login com e-mail/senha
- Ou login com Google/Social
- Storage local como backup

### Boas Práticas Implementadas

```typescript
// ✅ Sempre passa user_id
await supabase
  .from("daily_entries")
  .insert({ user_id: userId, texto, emocao });

// ✅ Sempre filtra por user_id
await supabase
  .from("daily_entries")
  .select("*")
  .eq("user_id", userId);

// ❌ NUNCA fazer query sem filtro de usuário
// await supabase.from("daily_entries").select("*"); // ERRADO!
```

---

## 🐛 Troubleshooting

### Problema: "Nenhum registro aparece"

**Possíveis causas:**
1. Sessão não foi criada
2. Erro de conexão com Supabase
3. RLS bloqueando acesso

**Solução:**
```typescript
// Abra o console do navegador (F12)
// Verifique se há erros
console.log("User ID:", userId);

// Teste a conexão
const { data, error } = await supabase
  .from("daily_entries")
  .select("*");
console.log("Data:", data, "Error:", error);
```

---

### Problema: "PDF não baixa"

**Possíveis causas:**
1. Lista vazia
2. Bloqueador de pop-ups
3. Erro na geração

**Solução:**
1. Verifique se há registros
2. Permita downloads do site
3. Verifique console para erros

---

### Problema: "Layout quebrado em mobile"

**Solução:**
1. Limpe cache do navegador
2. Verifique se está usando Chrome/Safari atualizados
3. Teste em modo de navegação anônima

---

## 📊 Melhorias Futuras

### Curto Prazo
- [ ] Editar registros existentes
- [ ] Deletar registros
- [ ] Filtros por data
- [ ] Busca de registros
- [ ] Tema escuro

### Médio Prazo
- [ ] Gráficos de emoções ao longo do tempo
- [ ] Estatísticas semanais/mensais
- [ ] Anexar fotos aos registros
- [ ] Tags personalizadas
- [ ] Lembretes para registrar

### Longo Prazo
- [ ] Sincronização entre dispositivos
- [ ] Backup automático
- [ ] Compartilhamento direto com profissional
- [ ] Aplicativo mobile nativo
- [ ] Integração com wearables

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique esta documentação
2. Procure no FAQ do Lovable
3. Entre em contato com o desenvolvedor

---

## 📜 Licença

Este projeto é de uso pessoal e terapêutico. Todos os dados são privados e confidenciais.

---

## 🙏 Agradecimentos

- **Lovable** - Plataforma de desenvolvimento
- **Supabase** - Backend e banco de dados
- **Shadcn UI** - Componentes de interface
- **Comunidade Open Source** - Bibliotecas utilizadas

---

**Documentação gerada em:** 2025-01-19
**Versão:** 1.0.0
**Última atualização:** 2025-01-19
