import { useState } from "react";
import { Link } from "react-router-dom";
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
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
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
        <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Sprout className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="font-display text-2xl">Recuperar Senha</CardTitle>
                    <CardDescription>
                        {sent ? "Email enviado com sucesso!" : "Informe seu email para receber as instruções"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sent ? (
                        <div className="text-center space-y-4">
                            <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                            <p className="text-sm text-muted-foreground">
                                Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.
                            </p>
                            <Link to="/login">
                                <Button variant="outline" className="w-full mt-2">
                                    <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Enviando..." : (
                                    <>
                                        <Mail className="h-4 w-4 mr-2" /> Enviar Instruções
                                    </>
                                )}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                <Link to="/login" className="text-primary hover:underline">
                                    <ArrowLeft className="h-3 w-3 inline mr-1" />Voltar ao login
                                </Link>
                            </p>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecuperarSenha;

