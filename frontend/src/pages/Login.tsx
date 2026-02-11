import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, senha });
      navigate("/");
    } catch {
      toast({ title: "Erro ao entrar", description: "Email ou senha inválidos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="auth-card">
          <CardHeader className="text-center pt-8 pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-[var(--shadow-soft)]">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl tracking-tight">HortaConnect</CardTitle>
            <CardDescription className="text-base">Faça login para gerenciar sua horta</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required className="h-11" />
              </div>
              <Button type="submit" className="w-full h-11 font-semibold text-base" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              <Link to="/recuperar-senha" className="text-muted-foreground hover:text-primary transition-colors">Esqueci minha senha</Link>
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Não tem conta? <Link to="/cadastro" className="text-primary font-medium hover:underline">Cadastre-se</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
