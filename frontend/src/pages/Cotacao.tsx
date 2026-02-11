import { useState } from "react";
import { cotacaoApi, ProdutoCotacaoDTO } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, MapPin, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      toast({
        title: "Erro na busca",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Cotação de Preços</h1>
          <p className="text-muted-foreground">Compare preços de produtos na sua região (Raio 15km)</p>
        </div>

        <form onSubmit={buscar} className="flex gap-3 max-w-lg">
          <Input
              placeholder="Ex: adubo, semente, fertilizante..."
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              className="bg-white"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "..." : <Search className="mr-2 h-4 w-4" />}
            {loading ? "Buscando" : "Buscar"}
          </Button>
        </form>

        {!searched ? (
            <div className="flex flex-col items-center py-16 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-3" />
              <p>Digite um produto acima para comparar preços</p>
            </div>
        ) : resultados.length === 0 && !loading ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhum resultado encontrado para "{termo}".
            </p>
        ) : (
            <div className="space-y-3">
              {resultados.map((r, i) => (
                  <Card key={i}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-semibold capitalize">{r.nome.toLowerCase()}</p>
                        <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            {r.estabelecimento}
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {r.logradouro}, {r.numero} - {r.bairro}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Preço</p>
                        <p className="text-lg font-bold text-primary">{r.preco}</p>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
};

export default Cotacao;
