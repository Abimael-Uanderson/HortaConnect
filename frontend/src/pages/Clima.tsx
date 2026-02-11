import { useEffect, useState } from "react";
import { climaApi, ClimaAtualResponse } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Droplets, Wind, ThermometerSun, MapPin } from "lucide-react";

const Clima = () => {
  const [clima, setClima] = useState<ClimaAtualResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    climaApi.atual().then(setClima).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-16 text-muted-foreground">Carregando dados climáticos...</p>;

  if (!clima) return (
    <div className="flex flex-col items-center py-16 text-muted-foreground">
      <CloudSun className="h-12 w-12 mb-3" />
      <p>Não foi possível obter dados climáticos</p>
      <p className="text-xs">Verifique se seu CEP está cadastrado</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Clima Atual</h1>
        <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> {clima.cidade}</p>
      </div>

      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <ThermometerSun className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-5xl font-bold font-display">{clima.temperatura}°C</p>
              <p className="text-lg capitalize text-muted-foreground">{clima.descricao}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <Droplets className="h-5 w-5 text-info" />
              <div><p className="text-xs text-muted-foreground">Umidade</p><p className="font-semibold">{clima.umidade}%</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Vento</p><p className="font-semibold">{clima.vento} km/h</p></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clima;
