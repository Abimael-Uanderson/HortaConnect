import { useEffect, useState } from "react";
import { alertaApi, AlertaClimaticoResponse } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck } from "lucide-react";

const Alertas = () => {
  const [alertas, setAlertas] = useState<AlertaClimaticoResponse[]>([]);

  const load = () => alertaApi.listar().then(setAlertas).catch(() => {});
  useEffect(() => { load(); }, []);

  const marcarLido = async (id: number) => {
    await alertaApi.marcarLido(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Alertas Climáticos</h1>
        <p className="text-muted-foreground">Notificações sobre o clima da sua região</p>
      </div>

      {alertas.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-muted-foreground">
          <Bell className="h-12 w-12 mb-3" />
          <p>Nenhum alerta no momento</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((a) => (
            <Card key={a.id} className={a.lido ? "opacity-60" : ""}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Bell className={`h-5 w-5 ${a.lido ? "text-muted-foreground" : "text-warning"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{a.mensagem}</p>
                      <Badge variant="outline" className="text-xs">{a.tipoAlerta}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(a.dataAlerta).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
                {!a.lido && (
                  <Button variant="ghost" size="sm" onClick={() => marcarLido(a.id)}>
                    <CheckCheck className="mr-1 h-4 w-4" /> Lido
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alertas;
