import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { plantioApi, climaApi, alertaApi, PlantioResponse, ClimaAtualResponse, AlertaClimaticoResponse } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, CloudSun, Bell, Droplets, Wind, Leaf, TrendingUp } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } } as const;
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } } as const;

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
    <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <div className="page-header">
          <h1>
            Olá, {usuario?.nome?.split(" ")[0]}{" "}
            <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite]">🌱</span>
          </h1>
          <p>Acompanhe o resumo da sua horta em tempo real</p>
        </div>
      </motion.div>

      <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" variants={container}>
        <motion.div variants={item}>
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Plantios Ativos</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Sprout className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-bold font-display tracking-tight">{plantios.length}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> culturas em andamento
            </p>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Alertas Não Lidos</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white transition-colors duration-300">
                <Bell className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-bold font-display tracking-tight">{alertasNaoLidos}</p>
            <p className="text-xs text-muted-foreground mt-1">notificações pendentes</p>
          </div>
        </motion.div>

        {clima && (
          <motion.div variants={item}>
            <div className="stat-card group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Clima — {clima.cidade}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info group-hover:bg-info group-hover:text-white transition-colors duration-300">
                  <CloudSun className="h-5 w-5" />
                </div>
              </div>
              <p className="text-4xl font-bold font-display tracking-tight">{clima.temperatura}°C</p>
              <p className="text-sm text-muted-foreground capitalize mt-1">{clima.descricao}</p>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-full"><Droplets className="h-3 w-3" /> {clima.umidade}%</span>
                <span className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-full"><Wind className="h-3 w-3" /> {clima.vento} km/h</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {plantios.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold tracking-tight">Seus Plantios</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plantios.slice(0, 6).map((p, i) => (
              <motion.div key={p.id} variants={item}>
                <Card className="glass-card-hover border-border/40">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <Sprout className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{p.nomeCultura}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {p.cultivar || "Sem cultivar"} · <span className="text-primary/80 font-medium">{p.estagioCrescimento}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
