import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { agendaCuidadoApi, plantioApi, AgendaCuidadoResponse, PlantioResponse, AgendaCuidadoRequest } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Plus, Check, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tiposCuidado = ["REGA", "ADUBACAO", "PODA", "CONTROLE_PRAGAS", "COLHEITA", "REPLANTIO"];

const statusColors: Record<string, string> = {
  PENDENTE: "bg-warning/15 text-warning border-warning/20",
  CONCLUIDO: "bg-success/15 text-success border-success/20",
  ATRASADO: "bg-destructive/15 text-destructive border-destructive/20",
  CANCELADO: "bg-muted text-muted-foreground border-border",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } } as const;
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } } as const;

const Agenda = () => {
  const [cuidados, setCuidados] = useState<AgendaCuidadoResponse[]>([]);
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [selectedPlantio, setSelectedPlantio] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AgendaCuidadoRequest>({ plantioId: 0, tipoCuidado: "", dataAgendamento: "", descricao: "" });
  const { toast } = useToast();

  useEffect(() => { plantioApi.listar().then(setPlantios).catch(() => {}); }, []);

  useEffect(() => {
    if (selectedPlantio) {
      agendaCuidadoApi.listarPorPlantio(Number(selectedPlantio)).then(setCuidados).catch(() => setCuidados([]));
    }
  }, [selectedPlantio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await agendaCuidadoApi.agendar(form);
      toast({ title: "Cuidado agendado!" });
      setOpen(false);
      if (selectedPlantio) agendaCuidadoApi.listarPorPlantio(Number(selectedPlantio)).then(setCuidados);
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const concluir = async (id: number) => {
    await agendaCuidadoApi.concluir(id);
    if (selectedPlantio) agendaCuidadoApi.listarPorPlantio(Number(selectedPlantio)).then(setCuidados);
  };

  const cancelar = async (id: number) => {
    await agendaCuidadoApi.cancelar(id);
    if (selectedPlantio) agendaCuidadoApi.listarPorPlantio(Number(selectedPlantio)).then(setCuidados);
  };

  const deletar = async (id: number) => {
    await agendaCuidadoApi.deletar(id);
    if (selectedPlantio) agendaCuidadoApi.listarPorPlantio(Number(selectedPlantio)).then(setCuidados);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1>Agenda de Cuidados</h1>
          <p>Organize os cuidados das suas plantas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11 px-5 font-semibold"><Plus className="mr-2 h-4 w-4" /> Agendar</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle className="font-display text-xl">Agendar Cuidado</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Plantio</Label>
                <Select onValueChange={(v) => setForm((f) => ({ ...f, plantioId: Number(v) }))}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{plantios.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nomeCultura}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tipo de Cuidado</Label>
                <Select onValueChange={(v) => setForm((f) => ({ ...f, tipoCuidado: v }))}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{tiposCuidado.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Data</Label><Input type="date" onChange={(e) => setForm((f) => ({ ...f, dataAgendamento: e.target.value }))} required className="h-11" /></div>
              <div className="space-y-1.5"><Label>Descrição</Label><Textarea onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} /></div>
              <Button type="submit" className="w-full h-11 font-semibold">Agendar</Button>
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
          <CalendarCheck />
          <p>Selecione um plantio para ver a agenda</p>
        </div>
      ) : cuidados.length === 0 ? (
        <div className="empty-state py-12">
          <CalendarCheck />
          <p>Nenhum cuidado agendado</p>
        </div>
      ) : (
        <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
          {cuidados.map((c) => (
            <motion.div key={c.id} variants={item}>
              <Card className="glass-card-hover border-border/40">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{c.tipoCuidado}</p>
                      <p className="text-xs text-muted-foreground">{c.dataAgendamento} · {c.descricao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs border ${statusColors[c.statusCuidado] || ""}`}>{c.statusCuidado}</Badge>
                    {c.statusCuidado === "PENDENTE" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => concluir(c.id)}><Check className="h-4 w-4 text-success" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => cancelar(c.id)}><X className="h-4 w-4" /></Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deletar(c.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
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

export default Agenda;
