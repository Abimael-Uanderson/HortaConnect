import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { plantioApi, PlantioResponse, PlantioRequest } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// IMPORTANTE: Adicionados os ícones Printer e Filter
import { Sprout, Plus, Pencil, Trash2, Printer, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const estagios = ["SEMEADURA", "GERMINACAO", "CRESCIMENTO_VEGETATIVO", "FLORACAO", "FRUTIFICACAO", "COLHEITA", "OUTRO"];
const emptyForm: PlantioRequest = { nomeCultura: "", cultivar: "", dataPlantio: "", tipoSolo: "", estagioCrescimento: "", areaM2: 0, observacoes: "" };

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } } as const;
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } } as const;

const Plantios = () => {
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PlantioRequest>(emptyForm);
  // NOVO: Estado para o filtro
  const [filtroEstagio, setFiltroEstagio] = useState<string>("TODOS");
  const { toast } = useToast();


  const load = () => plantioApi.listar(filtroEstagio).then(setPlantios).catch(() => {});

  useEffect(() => { load(); }, [filtroEstagio]);

  const handleChange = (field: string, value: string | number) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) await plantioApi.atualizar(editId, form);
      else await plantioApi.criar(form);
      toast({ title: editId ? "Plantio atualizado!" : "Plantio criado!" });
      setOpen(false); setEditId(null); setForm(emptyForm); load();
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const handleEdit = (p: PlantioResponse) => {
    setForm({ nomeCultura: p.nomeCultura, cultivar: p.cultivar, dataPlantio: p.dataPlantio, tipoSolo: p.tipoSolo, estagioCrescimento: p.estagioCrescimento, areaM2: p.areaM2, observacoes: p.observacoes });
    setEditId(p.id); setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try { await plantioApi.deletar(id); toast({ title: "Plantio removido" }); load(); }
    catch { toast({ title: "Erro ao remover", variant: "destructive" }); }
  };

  return (
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* CABEÇALHO EXCLUSIVO PARA IMPRESSÃO (Fica invisível na tela normal) */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Relatório de Plantios</h1>
          <p className="text-gray-600">
            <strong>Filtro aplicado:</strong> {filtroEstagio === "TODOS" ? "Todos os Estágios" : filtroEstagio}
          </p>
          <p className="text-gray-600"><strong>Data de emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
          <hr className="my-4 border-black" />
        </div>

        {/* CABEÇALHO DA PÁGINA COM BOTÕES (Fica invisível na impressão) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div className="page-header mb-0">
            <h1>Meus Plantios</h1>
            <p>Gerencie suas culturas</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* BOTÃO DE FILTRO */}
            <div className="flex items-center gap-2 bg-background border rounded-md px-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filtroEstagio} onValueChange={setFiltroEstagio}>
                <SelectTrigger className="w-[150px] border-0 focus:ring-0 shadow-none bg-transparent">
                  <SelectValue placeholder="Filtrar estágio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos os Estágios</SelectItem>
                  {estagios.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* BOTÃO DE IMPRIMIR RELATÓRIO */}
            <Button variant="outline" onClick={() => window.print()} className="h-11 font-semibold gap-2">
              <Printer className="h-4 w-4" /> Relatório
            </Button>

            {/* BOTÃO DE NOVO PLANTIO E DIALOG */}
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm(emptyForm); } }}>
              <DialogTrigger asChild>
                <Button className="h-11 px-5 font-semibold"><Plus className="mr-2 h-4 w-4" /> Novo Plantio</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle className="font-display text-xl">{editId ? "Editar Plantio" : "Novo Plantio"}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5"><Label>Cultura</Label><Input value={form.nomeCultura} onChange={(e) => handleChange("nomeCultura", e.target.value)} required className="h-11" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Cultivar</Label><Input value={form.cultivar} onChange={(e) => handleChange("cultivar", e.target.value)} className="h-11" /></div>
                    <div className="space-y-1.5"><Label>Data Plantio</Label><Input type="date" value={form.dataPlantio} onChange={(e) => handleChange("dataPlantio", e.target.value)} className="h-11" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Tipo de Solo</Label><Input value={form.tipoSolo} onChange={(e) => handleChange("tipoSolo", e.target.value)} className="h-11" /></div>
                    <div className="space-y-1.5"><Label>Área (m²)</Label><Input type="number" value={form.areaM2} onChange={(e) => handleChange("areaM2", Number(e.target.value))} className="h-11" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Estágio</Label>
                    <Select value={form.estagioCrescimento} onValueChange={(v) => handleChange("estagioCrescimento", v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{estagios.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => handleChange("observacoes", e.target.value)} /></div>
                  <Button type="submit" className="w-full h-11 font-semibold">{editId ? "Salvar" : "Criar"}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* LISTAGEM DOS PLANTIOS */}
        {plantios.length === 0 ? (
            <div className="empty-state print:text-black print:border-none">
              <Sprout />
              <p>Nenhum plantio encontrado para este filtro.</p>
            </div>
        ) : (
            <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 print:gap-4" variants={container} initial="hidden" animate="show">
              {plantios.map((p) => (
                  <motion.div key={p.id} variants={item}>
                    {/* Ajuste nas classes do Card para imprimir sem sombras e quebras erradas */}
                    <Card className="glass-card-hover border-border/40 print:shadow-none print:border-gray-300 print:break-inside-avoid">
                      <CardContent className="pt-5 pb-4">

                        {/* Cabeçalho do Card */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 print:bg-transparent print:border">
                              <Sprout className="h-5 w-5 text-primary print:text-black" />
                            </div>
                            <div>
                              <p className="font-semibold print:text-black">{p.nomeCultura}</p>
                              <p className="text-xs text-muted-foreground print:text-gray-700">{p.cultivar}</p>
                            </div>
                          </div>
                          {/* Botões de Ação: Escondidos na Impressão (print:hidden) */}
                          <div className="flex gap-0.5 print:hidden">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                          </div>
                        </div>

                        {/* Detalhes do Card */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground print:text-gray-800">
                          <span className="bg-muted/50 px-2 py-1 rounded-md print:bg-transparent print:border print:border-gray-200">Solo: {p.tipoSolo || "—"}</span>
                          <span className="bg-muted/50 px-2 py-1 rounded-md print:bg-transparent print:border print:border-gray-200">Área: {p.areaM2 || "—"} m²</span>
                          <span className="bg-primary/5 px-2 py-1 rounded-md text-primary font-medium print:bg-transparent print:border print:border-gray-200 print:text-black">Estágio: {p.estagioCrescimento || "—"}</span>
                          <span className="bg-muted/50 px-2 py-1 rounded-md print:bg-transparent print:border print:border-gray-200">Data: {p.dataPlantio || "—"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </motion.div>
        )}
      </motion.div>
  );
};

export default Plantios;