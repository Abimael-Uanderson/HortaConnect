const API_BASE_URL = "/api";


async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Erro ${res.status}`);
  }
  return res.json();
}

// ─── Usuário ──────────────────────────────────────
export interface LoginRequest { email: string; senha: string; }
export interface LoginResponse { token: string; usuario: UsuarioResponse; }
export interface UsuarioRequest { nome: string; email: string; telefone: string; senha: string; cep: string; cidade: string; estado: string; }
export interface UsuarioResponse { id: number; nome: string; email: string; telefone: string; cep: string; cidade: string; estado: string; dataCadastro: string; }

export const usuarioApi = {
  login: (data: LoginRequest) => request<LoginResponse>("/usuarios/login", { method: "POST", body: JSON.stringify(data) }),
  cadastrar: (data: UsuarioRequest) => request<UsuarioResponse>("/usuarios", { method: "POST", body: JSON.stringify(data) }),
  buscarPorId: (id: number) => request<UsuarioResponse>(`/usuarios/${id}`),
  atualizar: (id: number, data: UsuarioRequest) => request<UsuarioResponse>(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletar: (id: number) => request<void>(`/usuarios/${id}`, { method: "DELETE" }),
};

// ─── Plantio ──────────────────────────────────────
export interface PlantioRequest { nomeCultura: string; cultivar: string; dataPlantio: string; tipoSolo: string; estagioCrescimento: string; areaM2: number; observacoes: string; }
export interface PlantioResponse { id: number; nomeCultura: string; cultivar: string; dataPlantio: string; tipoSolo: string; estagioCrescimento: string; areaM2: number; observacoes: string; ativo: boolean; }

export const plantioApi = {
  criar: (data: PlantioRequest) => request<PlantioResponse>("/plantios", { method: "POST", body: JSON.stringify(data) }),
  listar: () => request<PlantioResponse[]>("/plantios"),
  buscarPorId: (id: number) => request<PlantioResponse>(`/plantios/${id}`),
  atualizar: (id: number, data: PlantioRequest) => request<PlantioResponse>(`/plantios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletar: (id: number) => request<void>(`/plantios/${id}`, { method: "DELETE" }),
};

// ─── Agenda Cuidados ──────────────────────────────
export interface AgendaCuidadoRequest { plantioId: number; tipoCuidado: string; dataAgendamento: string; descricao: string; }
export interface AgendaCuidadoResponse { id: number; plantioId: number; nomeCultura: string; tipoCuidado: string; dataAgendamento: string; descricao: string; statusCuidado: string; }

export const agendaCuidadoApi = {
  agendar: (data: AgendaCuidadoRequest) => request<AgendaCuidadoResponse>("/agenda-cuidados", { method: "POST", body: JSON.stringify(data) }),
  listarPorPlantio: (plantioId: number) => request<AgendaCuidadoResponse[]>(`/agenda-cuidados/plantio/${plantioId}`),
  concluir: (id: number) => request<AgendaCuidadoResponse>(`/agenda-cuidados/${id}/concluir`, { method: "PATCH" }),
  cancelar: (id: number) => request<void>(`/agenda-cuidados/${id}/cancelar`, { method: "PATCH" }),
  atualizar: (id: number, data: AgendaCuidadoRequest) => request<AgendaCuidadoResponse>(`/agenda-cuidados/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletar: (id: number) => request<void>(`/agenda-cuidados/${id}`, { method: "DELETE" }),
};

// ─── Histórico Horta ──────────────────────────────
export interface HistoricoHortaRequest { plantioId: number; titulo: string; descricao: string; imagem: string; dataEvento: string; }
export interface HistoricoHortaResponse { id: number; plantioId: number; nomeCultura: string; titulo: string; descricao: string; imagem: string; dataEvento: string; }

export const historicoApi = {
  registrar: (data: HistoricoHortaRequest) => request<HistoricoHortaResponse>("/historico", { method: "POST", body: JSON.stringify(data) }),
  listar: (plantioId: number) => request<HistoricoHortaResponse[]>(`/historico/plantio/${plantioId}`),
  excluir: (id: number) => request<void>(`/historico/${id}`, { method: "DELETE" }),
  atualizar: (id: number, data: HistoricoHortaRequest) => request<HistoricoHortaResponse>(`/historico/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Clima ────────────────────────────────────────
export interface ClimaAtualResponse { cidade: string; temperatura: number; descricao: string; umidade: number; vento: number; icone: string; }

export const climaApi = {
  atual: () => request<ClimaAtualResponse>("/clima/atual"),
};

// ─── Alertas Climáticos ───────────────────────────
export interface AlertaClimaticoResponse { id: number; tipoAlerta: string; mensagem: string; lido: boolean; dataAlerta: string; }

export const alertaApi = {
  listar: () => request<AlertaClimaticoResponse[]>("/alertas"),
  marcarLido: (id: number) => request<void>(`/alertas/${id}/lido`, { method: "PATCH" }),
};

// ─── Cotação ──────────────────────────────────────
export interface ProdutoCotacaoDTO { nome: string; preco: number; nomeEstabelecimento: string; endereco: string; }

export const cotacaoApi = {
  buscar: (termo: string) => request<ProdutoCotacaoDTO[]>(`/cotacoes/buscar?termo=${encodeURIComponent(termo)}`),
};
