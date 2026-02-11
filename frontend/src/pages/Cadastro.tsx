import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usuarioApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", senha: "", confirmarSenha: "", cep: "", cidade: "", estado: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);
      if (!response.ok) throw new Error("CEP não encontrado");
      const data = await response.json();
      setForm((f) => ({ ...f, cidade: data.city, estado: data.state }));
      toast({ description: `Endereço encontrado: ${data.city}/${data.state}` });
    } catch {
      toast({ title: "CEP não encontrado", description: "Preencha o endereço manualmente.", variant: "destructive" });
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.senha !== form.confirmarSenha) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { confirmarSenha, ...dadosParaEnvio } = form;
      const dadosFinais = { ...dadosParaEnvio, cep: form.cep.replace("-", "") };
      await usuarioApi.cadastrar(dadosFinais);
      toast({ title: "Conta criada!", description: "Agora faça login." });
      navigate("/login");
    } catch (error: any) {
      toast({ title: "Erro ao cadastrar", description: error.message || "Verifique os dados.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="auth-card">
          <CardHeader className="text-center pt-8 pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-[var(--shadow-soft)]">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl tracking-tight">Criar Conta</CardTitle>
            <CardDescription className="text-base">Cadastre-se no HortaConnect</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={(e) => handleChange("telefone", e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-1">
                  <Label>CEP</Label>
                  <div className="relative">
                    <Input value={form.cep} onChange={(e) => handleChange("cep", e.target.value)} onBlur={handleCepBlur} placeholder="00000-000" maxLength={9} className="h-11" />
                    {loadingCep && <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Cidade</Label>
                  <Input value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)} required readOnly className="h-11 bg-muted/50" />
                </div>
                <div className="space-y-1">
                  <Label>Estado</Label>
                  <Input value={form.estado} onChange={(e) => handleChange("estado", e.target.value)} required readOnly className="h-11 bg-muted/50" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Senha</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={form.senha} onChange={(e) => handleChange("senha", e.target.value)} required className="pr-10 h-11" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Confirmar Senha</Label>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} value={form.confirmarSenha} onChange={(e) => handleChange("confirmarSenha", e.target.value)} required className="pr-10 h-11" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-semibold text-base" disabled={loading}>
                {loading ? "Criando..." : "Cadastrar"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Cadastro;
