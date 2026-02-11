import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { historicoApi, plantioApi, HistoricoHortaResponse, PlantioResponse, HistoricoHortaRequest } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { History, Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } } as const;
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } } as const;

const Historico = () => {
  const [historicos, setHistoricos] = useState<HistoricoHortaResponse[]>([]);
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [selectedPlantio, setSelectedPlantio] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<HistoricoHortaRequest>({ plantioId: 0, titulo: "", descricao: "", imagem: "", dataEvento: "" });
  const [editForm, setEditForm] = useState<HistoricoHortaRequest>({ plantioId: 0, titulo: "", descricao: "", imagem: "", dataEvento: "" });
  const { toast } = useToast();

  useEffect(() => { plantioApi.listar().then(setPlantios).catch(() => {}); }, []);

  useEffect(() => {
    if (selectedPlantio) historicoApi.listar(Number(selectedPlantio)).then(setHistoricos).catch(() => setHistoricos([]));
  }, [selectedPlantio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await historicoApi.registrar(form);
      toast({ title: "Registro adicionado!" });
      setOpen(false);
      if (selectedPlantio) historicoApi.listar(Number(selectedPlantio)).then(setHistoricos);
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const excluir = async (id: number) => {
    await historicoApi.excluir(id);
    if (selectedPlantio) historicoApi.listar(Number(selectedPlantio)).then(setHistoricos);
  };

  const abrirEdicao = (h: HistoricoHortaResponse) => {
    setEditId(h.id);
    setEditForm({ plantioId: h.plantioId, titulo: h.titulo, descricao: h.descricao, imagem: h.imagem || "", dataEvento: h.dataEvento });
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      await historicoApi.atualizar(editId, editForm);
      toast({ title: "Registro atualizado!" });
      setEditOpen(false);
      if (selectedPlantio) historicoApi.listar(Number(selectedPlantio)).then(setHistoricos);
    } catch { toast({ title: "Erro ao atualizar", variant: "destructive" }); }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1>Histórico da Horta</h1>
          <p>Timeline de eventos dos seus plantios</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11 px-5 font-semibold"><Plus className="mr-2 h-4 w-4" /> Registrar</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle className="font-display text-xl">Novo Registro</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Plantio</Label>
                <Select onValueChange={(v) => setForm((f) => ({ ...f, plantioId: Number(v) }))}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{plantios.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nomeCultura}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Título</Label><Input onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required className="h-11" /></div>
              <div className="space-y-1.5"><Label>Descrição</Label><Textarea onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} required /></div>
              <div className="space-y-1.5"><Label>URL da Imagem</Label><Input onChange={(e) => setForm((f) => ({ ...f, imagem: e.target.value }))} className="h-11" /></div>
              <div className="space-y-1.5"><Label>Data</Label><Input type="date" onChange={(e) => setForm((f) => ({ ...f, dataEvento: e.target.value }))} required className="h-11" /></div>
              <Button type="submit" className="w-full h-11 font-semibold">Registrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-xs">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filtrar por Plantio</Label>
        <Select value={selectedPlantio} onValueChange={setSelectedPlantio}>
          <SelectTrigger className="h-11 mt-1.5"><SelectValue placeholder="Selecione um plantio" /></SelectTrigger>
          <SelectContent>{plantios.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nomeCultura}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {!selectedPlantio ? (
        <div className="empty-state">
          <History />
          <p>Selecione um plantio para ver o histórico</p>
        </div>
      ) : historicos.length === 0 ? (
        <div className="empty-state py-12">
          <History />
          <p>Nenhum registro</p>
        </div>
      ) : (
        <motion.div className="relative space-y-4 pl-8 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/30 before:to-transparent before:rounded-full" variants={container} initial="hidden" animate="show">
          {historicos.map((h) => (
            <motion.div key={h.id} className="relative" variants={item}>
              <div className="absolute -left-8 top-4 h-5 w-5 rounded-full bg-primary/20 border-[3px] border-primary shadow-[var(--shadow-glow)]" />
              <Card className="glass-card-hover border-border/40">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-base">{h.titulo}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{h.dataEvento}</p>
                      <p className="mt-2 text-sm text-foreground/80">{h.descricao}</p>
                      {h.imagem && <img src={h.imagem} alt={h.titulo} className="mt-3 h-36 rounded-xl object-cover shadow-sm" />}
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0 ml-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => abrirEdicao(h)}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => excluir(h.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-display text-xl">Editar Registro</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-1.5"><Label>Título</Label><Input value={editForm.titulo} onChange={(e) => setEditForm((f) => ({ ...f, titulo: e.target.value }))} required className="h-11" /></div>
            <div className="space-y-1.5"><Label>Descrição</Label><Textarea value={editForm.descricao} onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))} required /></div>
            <div className="space-y-1.5"><Label>URL da Imagem</Label><Input value={editForm.imagem} onChange={(e) => setEditForm((f) => ({ ...f, imagem: e.target.value }))} className="h-11" /></div>
            <div className="space-y-1.5"><Label>Data</Label><Input type="date" value={editForm.dataEvento} onChange={(e) => setEditForm((f) => ({ ...f, dataEvento: e.target.value }))} required className="h-11" /></div>
            <Button type="submit" className="w-full h-11 font-semibold">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Historico;
