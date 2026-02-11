import { useEffect, useState } from "react";
import { plantioApi, PlantioResponse, PlantioRequest } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sprout, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const estagios = ["SEMEADURA", "GERMINACAO", "CRESCIMENTO", "FLORACAO", "FRUTIFICACAO", "COLHEITA"];

const emptyForm: PlantioRequest = { nomeCultura: "", cultivar: "", dataPlantio: "", tipoSolo: "", estagioCrescimento: "", areaM2: 0, observacoes: "" };

const Plantios = () => {
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PlantioRequest>(emptyForm);
  const { toast } = useToast();

  const load = () => plantioApi.listar().then(setPlantios).catch(() => {});
  useEffect(() => { load(); }, []);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Meus Plantios</h1>
          <p className="text-muted-foreground">Gerencie suas culturas</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Plantio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Editar Plantio" : "Novo Plantio"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1"><Label>Cultura</Label><Input value={form.nomeCultura} onChange={(e) => handleChange("nomeCultura", e.target.value)} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Cultivar</Label><Input value={form.cultivar} onChange={(e) => handleChange("cultivar", e.target.value)} /></div>
                <div className="space-y-1"><Label>Data Plantio</Label><Input type="date" value={form.dataPlantio} onChange={(e) => handleChange("dataPlantio", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Tipo de Solo</Label><Input value={form.tipoSolo} onChange={(e) => handleChange("tipoSolo", e.target.value)} /></div>
                <div className="space-y-1"><Label>Área (m²)</Label><Input type="number" value={form.areaM2} onChange={(e) => handleChange("areaM2", Number(e.target.value))} /></div>
              </div>
              <div className="space-y-1">
                <Label>Estágio</Label>
                <Select value={form.estagioCrescimento} onValueChange={(v) => handleChange("estagioCrescimento", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{estagios.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => handleChange("observacoes", e.target.value)} /></div>
              <Button type="submit" className="w-full">{editId ? "Salvar" : "Criar"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {plantios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Sprout className="h-12 w-12 mb-3" />
          <p>Nenhum plantio cadastrado</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plantios.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Sprout className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{p.nomeCultura}</p>
                      <p className="text-xs text-muted-foreground">{p.cultivar}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Solo: {p.tipoSolo || "—"}</span>
                  <span>Área: {p.areaM2 || "—"} m²</span>
                  <span>Estágio: {p.estagioCrescimento || "—"}</span>
                  <span>Data: {p.dataPlantio || "—"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plantios;
