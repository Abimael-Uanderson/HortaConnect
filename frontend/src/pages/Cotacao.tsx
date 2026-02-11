import { useState } from "react";
import { motion } from "framer-motion";
import { cotacaoApi, ProdutoCotacaoDTO } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, MapPin, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } } as const;
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } } as const;

const Cotacao = () => {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState<ProdutoCotacaoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termo.trim()) return;
    setLoading(true);
    setSearched(true);
    setResultados([]);
    try {
      const data = await cotacaoApi.buscar(termo);
      console.log("Dados do Java:", data);
      setResultados(data);
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setResultados([]);
      toast({ title: "Erro na busca", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1>Cotação de Preços</h1>
        <p>Compare preços de produtos na sua região (Raio 25km)</p>
      </div>

      <form onSubmit={buscar} className="flex gap-3 max-w-lg">
        <Input
          placeholder="Ex: adubo, semente, fertilizante..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          className="h-11 bg-card"
        />
        <Button type="submit" disabled={loading} className="h-11 px-6 font-semibold">
          {loading ? "..." : <Search className="mr-2 h-4 w-4" />}
          {loading ? "Buscando" : "Buscar"}
        </Button>
      </form>

      {!searched ? (
        <div className="empty-state">
          <ShoppingCart />
          <p>Digite um produto acima para comparar preços</p>
        </div>
      ) : resultados.length === 0 && !loading ? (
        <div className="empty-state py-12">
          <Search />
          <p>Nenhum resultado encontrado para "{termo}"</p>
        </div>
      ) : (
        <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
          {resultados.map((r, i) => (
            <motion.div key={i} variants={item}>
              <Card className="glass-card-hover border-border/40">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-semibold text-base capitalize">{r.nome.toLowerCase()}</p>
                    <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5">
                        <Store className="h-3 w-3 flex-shrink-0" />
                        {r.estabelecimento}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {r.logradouro}, {r.numero} - {r.bairro}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Preço</p>
                    <p className="text-2xl font-bold font-display text-primary">{r.preco}</p>
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

export default Cotacao;
