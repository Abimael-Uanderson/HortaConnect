import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { plantioApi, climaApi, alertaApi, PlantioResponse, ClimaAtualResponse, AlertaClimaticoResponse } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, CloudSun, Bell, Droplets, Wind, ThermometerSun } from "lucide-react";

const Dashboard = () => {
  const { usuario } = useAuth();
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [clima, setClima] = useState<ClimaAtualResponse | null>(null);
  const [alertas, setAlertas] = useState<AlertaClimaticoResponse[]>([]);

  useEffect(() => {
    plantioApi.listar().then(setPlantios).catch(() => {});
    climaApi.atual().then(setClima).catch(() => {});
    alertaApi.listar().then(setAlertas).catch(() => {});
  }, []);

  const alertasNaoLidos = alertas.filter((a) => !a.lido).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Olá, {usuario?.nome?.split(" ")[0]} 🌱</h1>
        <p className="text-muted-foreground">Resumo da sua horta</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plantios Ativos</CardTitle>
            <Sprout className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{plantios.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas Não Lidos</CardTitle>
            <Bell className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{alertasNaoLidos}</p>
          </CardContent>
        </Card>

        {clima && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clima - {clima.cidade}</CardTitle>
              <CloudSun className="h-5 w-5 text-info" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{clima.temperatura}°C</p>
              <p className="text-sm text-muted-foreground capitalize">{clima.descricao}</p>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> {clima.umidade}%</span>
                <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> {clima.vento} km/h</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {plantios.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold mb-3">Seus Plantios</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plantios.slice(0, 6).map((p) => (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Sprout className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{p.nomeCultura}</p>
                      <p className="text-xs text-muted-foreground">{p.cultivar || "Sem cultivar"} · {p.estagioCrescimento}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
