import { useEffect, useState } from "react";
import { agendaCuidadoApi, plantioApi, AgendaCuidadoResponse, PlantioResponse } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Plus, Check, X, Trash2, Sprout, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tiposCuidado = ["REGA", "ADUBACAO", "PODA", "CONTROLE_PRAGAS", "COLHEITA", "REPLANTIO"];

const statusColors: Record<string, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONCLUIDO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ATRASADO: "bg-red-100 text-red-700 border-red-200",
  CANCELADO: "bg-slate-100 text-slate-500 border-slate-200",
};

const Agenda = () => {
  const { toast } = useToast();

  const [cuidados, setCuidados] = useState<AgendaCuidadoResponse[]>([]);
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [selectedPlantio, setSelectedPlantio] = useState<string>("todos"); // Alterado para "todos" como padrão
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado do Formulário (Inicializado vazio)
  const [form, setForm] = useState({
    plantioId: "",
    tipoCuidado: "",
    dataAgendamento: "",
    descricao: ""
  });

  // 1. Carregar lista de plantios ao abrir a tela
  useEffect(() => {
    plantioApi.listar().then(setPlantios).catch(console.error);
    carregarTarefas(); // Carrega todas as tarefas iniciais
  }, []);

  // 2. Filtrar tarefas quando mudar o select
  useEffect(() => {
    carregarTarefas();
  }, [selectedPlantio]);

  // Função centralizada para recarregar a lista
  const carregarTarefas = async () => {
    setLoading(true);
    try {
      let dados;
      if (selectedPlantio && selectedPlantio !== "todos") {
        dados = await agendaCuidadoApi.listarPorPlantio(Number(selectedPlantio));
      } else {
        // Se a sua API tiver um método listarTodos(), use aqui.
        // Caso contrário, listamos por plantio se o usuário selecionar.
        // Se não tiver endpoint de "listar tudo", deixamos vazio ou buscamos de todos os plantios (complexo).
        // Vamos assumir que se não tiver filtro, não mostra nada ou você cria um endpoint 'listarTodos' no Java.
        // Para este exemplo, vou limpar se não tiver filtro para evitar erro.
        dados = [];
      }
      setCuidados(dados || []);
    } catch (error) {
      console.error(error);
      setCuidados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!form.descricao.trim()) {
      toast({ title: "Erro", description: "A descrição é obrigatória.", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        plantioId: Number(form.plantioId),
        tipoCuidado: form.tipoCuidado,
        dataAgendamento: form.dataAgendamento,
        descricao: form.descricao
      };

      await agendaCuidadoApi.agendar(payload);

      toast({ title: "Sucesso", description: "Cuidado agendado!" });
      setOpen(false);

      // Limpa o formulário
      setForm({ plantioId: "", tipoCuidado: "", dataAgendamento: "", descricao: "" });

      // Atualiza a lista (Força selecionar o plantio que acabou de criar ou atualiza o atual)
      if (selectedPlantio === "todos" || selectedPlantio === String(payload.plantioId)) {
        if (selectedPlantio === "todos") setSelectedPlantio(String(payload.plantioId));
        else carregarTarefas();
      }

    } catch (error) {
      toast({ title: "Erro ao agendar", description: "Verifique os dados.", variant: "destructive" });
    }
  };

  const alterarStatus = async (id: number, acao: 'concluir' | 'cancelar' | 'deletar') => {
    try {
      if (acao === 'concluir') await agendaCuidadoApi.concluir(id);
      if (acao === 'cancelar') await agendaCuidadoApi.cancelar(id);
      if (acao === 'deletar') await agendaCuidadoApi.deletar(id);

      toast({ title: "Atualizado!", className: "bg-emerald-50 text-emerald-800" });
      carregarTarefas(); // Recarrega a lista para mostrar a mudança
    } catch (error) {
      toast({ title: "Erro na operação", variant: "destructive" });
    }
  };

  return (
      <div className="space-y-6 p-4 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-800">Agenda de Cuidados</h1>
            <p className="text-muted-foreground">Organize as tarefas da horta</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" /> Agendar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">

                <div className="space-y-1">
                  <Label>Qual Planta?</Label>
                  {/* Adicionado value={form.plantioId} para controlar o input */}
                  <Select value={form.plantioId} onValueChange={(v) => setForm((f) => ({ ...f, plantioId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {plantios.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>{p.nomeCultura}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>O que fazer?</Label>
                    <Select value={form.tipoCuidado} onValueChange={(v) => setForm((f) => ({ ...f, tipoCuidado: v }))}>
                      <SelectTrigger><SelectValue placeholder="Tipo..." /></SelectTrigger>
                      <SelectContent>
                        {tiposCuidado.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Quando?</Label>
                    <Input
                        type="date"
                        value={form.dataAgendamento}
                        onChange={(e) => setForm((f) => ({ ...f, dataAgendamento: e.target.value }))}
                        required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Descrição (Obrigatório)</Label>
                  <Textarea
                      placeholder="Ex: Regar com 500ml de água"
                      value={form.descricao}
                      onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                      required
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Confirmar Agendamento</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtro Principal */}
        <div className="max-w-xs space-y-2">
          <Label>Filtrar tarefas por plantio:</Label>
          <Select value={selectedPlantio} onValueChange={setSelectedPlantio}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Selecione um plantio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Selecione para ver...</SelectItem> {/* Opção padrão */}
              {plantios.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.nomeCultura}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Tarefas */}
        {selectedPlantio === "todos" ? (
            <div className="flex flex-col items-center py-16 text-muted-foreground opacity-60 border-2 border-dashed rounded-xl">
              <Sprout className="h-12 w-12 mb-3" />
              <p>Selecione uma planta acima para ver a agenda</p>
            </div>
        ) : loading ? (
            <div className="text-center py-10"><Loader2 className="animate-spin h-8 w-8 mx-auto text-emerald-600"/></div>
        ) : cuidados.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 bg-slate-50 rounded-lg">Nenhuma tarefa encontrada para esta planta.</p>
        ) : (
            <div className="space-y-3">
              {cuidados.map((c) => (
                  <Card key={c.id} className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardContent className="flex items-center justify-between py-4 px-4">

                      <div className="flex items-start gap-4">
                        <div className="mt-1 bg-slate-100 p-2 rounded-full">
                          <CalendarCheck className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{c.tipoCuidado}</p>
                          <p className="text-sm text-slate-500 font-medium">
                            {new Date(c.dataAgendamento).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{c.descricao}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`px-3 py-1 ${statusColors[c.statusCuidado] || "bg-gray-100"}`}>
                          {c.statusCuidado}
                        </Badge>

                        <div className="flex items-center gap-1 mt-1">
                          {c.statusCuidado === "PENDENTE" && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" onClick={() => alterarStatus(c.id, 'concluir')}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:bg-amber-50" onClick={() => alterarStatus(c.id, 'cancelar')}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600" onClick={() => alterarStatus(c.id, 'deletar')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
};

export default Agenda;