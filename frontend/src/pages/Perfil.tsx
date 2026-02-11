import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usuarioApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Save, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Perfil = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    nome: usuario?.nome || "", email: usuario?.email || "", telefone: usuario?.telefone || "",
    senha: "", cep: usuario?.cep || "", cidade: usuario?.cidade || "", estado: usuario?.estado || "",
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (field === "cep") {
      value = value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
    }
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleCepBlur = async () => {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm((f) => ({ ...f, cidade: data.city, estado: data.state }));
    } catch {} finally { setLoadingCep(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setLoading(true);
    try {
      const dadosFinais = { ...form, cep: form.cep.replace("-", ""), senha: form.senha || undefined };
      await usuarioApi.atualizar(usuario.id, dadosFinais as any);
      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." });
      const updated = { ...usuario, ...dadosFinais, senha: undefined };
      localStorage.setItem("usuario", JSON.stringify(updated));
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Não foi possível salvar.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!usuario) return;
    setDeleting(true);
    try {
      await usuarioApi.deletar(usuario.id);
      toast({ title: "Conta excluída", description: "Sua conta foi removida." });
      logout();
      navigate("/login");
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Não foi possível excluir.", variant: "destructive" });
    } finally { setDeleting(false); }
  };

  return (
    <motion.div className="space-y-6 max-w-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais</p>
      </div>

      <Card className="glass-card border-border/40 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border/30">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold font-display text-xl">
              {usuario?.nome?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <CardTitle className="text-xl font-display">{usuario?.nome}</CardTitle>
              <CardDescription>{usuario?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={form.telefone} onChange={(e) => handleChange("telefone", e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>CEP</Label>
                <div className="relative">
                  <Input value={form.cep} onChange={(e) => handleChange("cep", e.target.value)} onBlur={handleCepBlur} placeholder="00000-000" maxLength={9} className="h-11" />
                  {loadingCep && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)} readOnly className="h-11 bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input value={form.estado} onChange={(e) => handleChange("estado", e.target.value)} readOnly className="h-11 bg-muted/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nova Senha (deixe em branco para manter)</Label>
              <Input type="password" value={form.senha} onChange={(e) => handleChange("senha", e.target.value)} placeholder="••••••••" className="h-11" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 font-semibold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/20 overflow-hidden">
        <CardHeader className="bg-destructive/5 border-b border-destructive/10">
          <CardTitle className="text-lg text-destructive font-display">Zona de Perigo</CardTitle>
          <CardDescription>Ações irreversíveis para sua conta</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleting} className="h-11 font-semibold">
                <Trash2 className="h-4 w-4 mr-2" /> Excluir Minha Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display">Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é irreversível. Todos os seus dados, plantios e históricos serão permanentemente excluídos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Sim, excluir conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Perfil;
