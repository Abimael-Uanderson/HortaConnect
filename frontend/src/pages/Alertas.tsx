import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { alertaApi, AlertaClimaticoResponse } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } } as const;
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } } as const;

const Alertas = () => {
  const [alertas, setAlertas] = useState<AlertaClimaticoResponse[]>([]);

  const load = () => alertaApi.listar().then(setAlertas).catch(() => {});
  useEffect(() => { load(); }, []);

  const marcarLido = async (id: number) => {
    await alertaApi.marcarLido(id);
    load();
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1>Alertas Climáticos</h1>
        <p>Notificações sobre o clima da sua região</p>
      </div>

      {alertas.length === 0 ? (
        <div className="empty-state">
          <Bell />
          <p>Nenhum alerta no momento</p>
        </div>
      ) : (
        <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
          {alertas.map((a) => (
            <motion.div key={a.id} variants={item}>
              <Card className={`glass-card-hover border-border/40 ${a.lido ? "opacity-50" : ""}`}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.lido ? "bg-muted" : "bg-warning/10"}`}>
                      <Bell className={`h-5 w-5 ${a.lido ? "text-muted-foreground" : "text-warning"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{a.mensagem}</p>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{a.tipoAlerta}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(a.dataAlerta).toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                  {!a.lido && (
                    <Button variant="outline" size="sm" onClick={() => marcarLido(a.id)} className="h-9 font-medium">
                      <CheckCheck className="mr-1.5 h-4 w-4" /> Lido
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Alertas;
