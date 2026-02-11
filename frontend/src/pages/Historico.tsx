import { useEffect, useState } from "react";
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Histórico da Horta</h1>
            <p className="text-muted-foreground">Timeline de eventos dos seus plantios</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Registrar</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Registro</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label>Plantio</Label>
                  <Select onValueChange={(v) => setForm((f) => ({ ...f, plantioId: Number(v) }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{plantios.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nomeCultura}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label>Título</Label><Input onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required /></div>
                <div className="space-y-1"><Label>Descrição</Label><Textarea onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} required /></div>
                <div className="space-y-1"><Label>URL da Imagem</Label><Input onChange={(e) => setForm((f) => ({ ...f, imagem: e.target.value }))} /></div>
                <div className="space-y-1"><Label>Data</Label><Input type="date" onChange={(e) => setForm((f) => ({ ...f, dataEvento: e.target.value }))} required /></div>
                <Button type="submit" className="w-full">Registrar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xs">
          <Label>Filtrar por Plantio</Label>
          <Select value={selectedPlantio} onValueChange={setSelectedPlantio}>
            <SelectTrigger><SelectValue placeholder="Selecione um plantio" /></SelectTrigger>
            <SelectContent>{plantios.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nomeCultura}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {!selectedPlantio ? (
            <div className="flex flex-col items-center py-16 text-muted-foreground">
              <History className="h-12 w-12 mb-3" />
              <p>Selecione um plantio para ver o histórico</p>
            </div>
        ) : historicos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum registro</p>
        ) : (
            <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-border">
              {historicos.map((h) => (
                  <div key={h.id} className="relative">
                    <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
                    <Card>
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{h.titulo}</p>
                            <p className="text-sm text-muted-foreground">{h.dataEvento}</p>
                            <p className="mt-1 text-sm">{h.descricao}</p>
                            {h.imagem && <img src={h.imagem} alt={h.titulo} className="mt-2 h-32 rounded-md object-cover" />}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => abrirEdicao(h)}><Pencil className="h-4 w-4 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => excluir(h.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
              ))}
            </div>
        )}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Registro</DialogTitle></DialogHeader>
            <form onSubmit={handleEdit} className="space-y-3">
              <div className="space-y-1"><Label>Título</Label><Input value={editForm.titulo} onChange={(e) => setEditForm((f) => ({ ...f, titulo: e.target.value }))} required /></div>
              <div className="space-y-1"><Label>Descrição</Label><Textarea value={editForm.descricao} onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))} required /></div>
              <div className="space-y-1"><Label>URL da Imagem</Label><Input value={editForm.imagem} onChange={(e) => setEditForm((f) => ({ ...f, imagem: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Data</Label><Input type="date" value={editForm.dataEvento} onChange={(e) => setEditForm((f) => ({ ...f, dataEvento: e.target.value }))} required /></div>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default Historico;
