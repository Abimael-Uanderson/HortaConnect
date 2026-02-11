import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usuarioApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Eye, EyeOff, Loader2 } from "lucide-react"; // Adicionei ícones novos
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  // Adicionei confirmarSenha ao estado
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    cep: "",
    cidade: "",
    estado: ""
  });

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false); // Loading específico do CEP

  // Estados para controlar visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    // Máscara simples para o CEP
    if (field === "cep") {
      value = value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
    }
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Função que busca o CEP quando tira o foco do campo (onBlur)
  const handleCepBlur = async () => {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);
      if (!response.ok) throw new Error("CEP não encontrado");

      const data = await response.json();

      // Preenche cidade e estado automaticamente
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

    // 1. Validação de senhas iguais
    if (form.senha !== form.confirmarSenha) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Remove o campo confirmarSenha e limpa o CEP antes de enviar para a API
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
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Sprout className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Criar Conta</CardTitle>
            <CardDescription>Cadastre-se no HortaConnect</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">

              <div className="space-y-1">
                <Label>Nome</Label>
                <Input value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} required />
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={(e) => handleChange("telefone", e.target.value)} required />
                </div>
                <div className="space-y-1 relative">
                  <Label>CEP</Label>
                  <div className="relative">
                    <Input
                        value={form.cep}
                        onChange={(e) => handleChange("cep", e.target.value)}
                        onBlur={handleCepBlur} // Busca ao sair do campo
                        placeholder="00000-000"
                        maxLength={9}
                    />
                    {loadingCep && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-primary" />}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Cidade</Label>
                  <Input value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)} required readOnly className="bg-muted/50" />
                </div>
                <div className="space-y-1">
                  <Label>Estado</Label>
                  <Input value={form.estado} onChange={(e) => handleChange("estado", e.target.value)} required readOnly className="bg-muted/50" />
                </div>
              </div>

              {/* Senha Principal com Olho */}
              <div className="space-y-1">
                <Label>Senha</Label>
                <div className="relative">
                  <Input
                      type={showPassword ? "text" : "password"}
                      value={form.senha}
                      onChange={(e) => handleChange("senha", e.target.value)}
                      required
                      className="pr-10"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha com Olho */}
              <div className="space-y-1">
                <Label>Confirmar Senha</Label>
                <div className="relative">
                  <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmarSenha}
                      onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                      required
                      className="pr-10"
                  />
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Criando..." : "Cadastrar"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Já tem conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link>
            </p>
          </CardContent>
        </Card>
      </div>
  );
};

export default Cadastro;