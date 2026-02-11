import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "/api";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/usuarios/recuperar-senha`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      setSent(true);
    } catch {
      toast({ title: "Erro", description: "Não foi possível processar. Verifique o email.", variant: "destructive" });
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
            <CardTitle className="font-display text-2xl tracking-tight">Recuperar Senha</CardTitle>
            <CardDescription className="text-base">
              {sent ? "Email enviado com sucesso!" : "Informe seu email para receber as instruções"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {sent ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-14 w-14 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full mt-2 h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                </div>
                <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                  {loading ? "Enviando..." : (<><Mail className="h-4 w-4 mr-2" /> Enviar Instruções</>)}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline"><ArrowLeft className="h-3 w-3 inline mr-1" />Voltar ao login</Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RecuperarSenha;
