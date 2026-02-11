package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.client.BrasilApiClient;
import br.com.hortaconnect.api.client.OpenWeatherClient;
import br.com.hortaconnect.api.dto.ClimaAtualResponseDTO;
import br.com.hortaconnect.api.dto.brasilapi.BrasilApiResponseDTO;
import br.com.hortaconnect.api.dto.openweather.DailyForecastDTO;
import br.com.hortaconnect.api.dto.openweather.GeoCodingDTO;
import br.com.hortaconnect.api.dto.openweather.WeatherResponseDTO;
import br.com.hortaconnect.api.entity.Usuario;
import br.com.hortaconnect.api.enums.TipoAlerta;
import br.com.hortaconnect.api.repository.UsuarioRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class ClimaService {

    private final UsuarioRepository usuarioRepository;
    private final AlertaClimaticoService alertaService;
    private final OpenWeatherClient weatherClient;
    private final BrasilApiClient brasilApiClient;

    public ClimaService(UsuarioRepository usuarioRepository, AlertaClimaticoService alertaService, OpenWeatherClient weatherClient, BrasilApiClient brasilApiClient) {
        this.usuarioRepository = usuarioRepository;
        this.alertaService = alertaService;
        this.weatherClient = weatherClient;
        this.brasilApiClient = brasilApiClient;
    }

    // Robô que roda todo dia às 06:00 da manhã
    @Scheduled(cron = "0 0 6 * * *")
    public void verificarClima() {
        System.out.println("🌦️ Robô de Clima Iniciado...");
        List<Usuario> usuarios = usuarioRepository.findByCepIsNotNull();

        for (Usuario user : usuarios) {
            try {
                processarUsuario(user);
            } catch (Exception e) {
                System.err.println("Erro usuário " + user.getId() + ": " + e.getMessage());
            }
        }
    }

    private void processarUsuario(Usuario usuario) {
        // Tenta corrigir coordenadas se estiverem faltando
        if (usuario.getLatitude() == null || usuario.getLongitude() == null) {
            atualizarCoordenadas(usuario);
        }

        // Se mesmo tentando atualizar, continuar null, desiste desse usuário
        if (usuario.getLatitude() == null) return;

        WeatherResponseDTO clima = weatherClient.buscarPrevisao7Dias(usuario.getLatitude(), usuario.getLongitude());

        if (clima != null && clima.getDaily() != null) {
            clima.getDaily().forEach(dia -> analisarDia(dia, usuario));
        }
    }

    // Método Robusto com Logs para Debugar o erro do "João"
    private void atualizarCoordenadas(Usuario usuario) {
        try {
            if (usuario.getCep() == null || usuario.getCep().length() < 8) {
                System.err.println("❌ CEP inválido ou nulo para usuário " + usuario.getNome() + ": " + usuario.getCep());
                return;
            }

            System.out.println("🔍 Buscando endereço para CEP: " + usuario.getCep());

            // 1. Busca Endereço no BrasilAPI
            BrasilApiResponseDTO endereco = brasilApiClient.buscarCep(usuario.getCep());

            if (endereco != null && endereco.getCity() != null) {
                System.out.println("✅ BrasilAPI encontrou: " + endereco.getCity() + "/" + endereco.getState());

                // 2. Busca Lat/Lon no OpenWeather usando Nome da Cidade
                GeoCodingDTO geo = weatherClient.buscarCoordenadas(endereco.getCity(), endereco.getState());

                if (geo != null) {
                    usuario.setLatitude(geo.getLat());
                    usuario.setLongitude(geo.getLon());
                    usuario.setCidade(endereco.getCity());
                    usuario.setEstado(endereco.getState());
                    usuarioRepository.save(usuario); // Salva no banco!
                    System.out.println("✅ Coordenadas salvas com sucesso: " + geo.getLat() + ", " + geo.getLon());
                } else {
                    System.err.println("❌ OpenWeather não achou coordenadas para a cidade: " + endereco.getCity());
                }
            } else {
                System.err.println("❌ BrasilAPI não achou endereço para o CEP: " + usuario.getCep());
            }
        } catch (Exception e) {
            System.err.println("❌ Erro crítico ao atualizar coordenadas: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void analisarDia(DailyForecastDTO dia, Usuario usuario) {
        LocalDate data = Instant.ofEpochSecond(dia.getDt()).atZone(ZoneId.systemDefault()).toLocalDate();
        if (data.isBefore(LocalDate.now())) return;

        double chuva = (dia.getRain() != null) ? dia.getRain() : 0.0;
        int weatherId = dia.getWeather().get(0).getId();

        // Regras de Negócio (Alertas)
        if (chuva > 20.0 || (weatherId >= 200 && weatherId < 300)) {
            alertaService.criarAlertaSeNaoExistir(usuario, TipoAlerta.CHUVA_FORTE,
                    "Tempestade/Chuva forte (" + String.format("%.1f", chuva) + "mm) prevista.", data.atStartOfDay());
        }

        if (dia.getTemp().getMax() > 35.0) {
            alertaService.criarAlertaSeNaoExistir(usuario, TipoAlerta.CALOR_INTENSO,
                    "Calor extremo (" + dia.getTemp().getMax() + "°C). Hidrate a horta.", data.atStartOfDay());
        }

        if (dia.getTemp().getMin() < 4.0) {
            alertaService.criarAlertaSeNaoExistir(usuario, TipoAlerta.GEADA,
                    "Risco de Geada (" + dia.getTemp().getMin() + "°C). Proteja as mudas.", data.atStartOfDay());
        }
    }

    // Método chamado pelo Front-end (Dashboard)
    public ClimaAtualResponseDTO obterClimaAtualDoUsuarioLogado() {
        // 1. Pega o usuário do Contexto de Segurança (Memória)
        Usuario usuarioToken = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 2. IMPORTANTE: Recarrega do Banco de Dados pelo ID
        // Isso garante que pegamos as coordenadas atualizadas se elas foram salvas recentemente
        Usuario usuario = usuarioRepository.findById(usuarioToken.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado no banco de dados."));

        // 3. Verifica e tenta corrigir coordenadas (Auto-recuperação)
        if (usuario.getLatitude() == null || usuario.getLongitude() == null) {
            System.out.println("⚠️ Usuário logado sem coordenadas. Tentando recuperar agora...");
            atualizarCoordenadas(usuario);

            // Recarrega de novo para ver se salvou
            usuario = usuarioRepository.findById(usuarioToken.getId()).orElseThrow();

            if (usuario.getLatitude() == null) {
                // Se ainda for null, o CEP está errado ou a API falhou
                throw new RuntimeException("Endereço não localizado. Verifique se o CEP " + usuario.getCep() + " está correto.");
            }
        }

        // 4. Busca na API de Clima
        WeatherResponseDTO clima = weatherClient.buscarPrevisao7Dias(usuario.getLatitude(), usuario.getLongitude());

        if (clima == null || clima.getCurrent() == null) {
            throw new RuntimeException("Serviço de clima indisponível no momento.");
        }

        // 5. Monta o DTO de resposta
        ClimaAtualResponseDTO dto = new ClimaAtualResponseDTO();
        dto.setCidade(usuario.getCidade());
        dto.setEstado(usuario.getEstado());

        dto.setTemperatura(clima.getCurrent().getTemp());
        dto.setSensacaoTermica(clima.getCurrent().getFeels_like());
        dto.setUmidade(clima.getCurrent().getHumidity());
        dto.setVento(clima.getCurrent().getWind_speed());

        if (clima.getCurrent().getWeather() != null && !clima.getCurrent().getWeather().isEmpty()) {
            dto.setDescricao(clima.getCurrent().getWeather().get(0).getDescription());
            dto.setIcone(clima.getCurrent().getWeather().get(0).getIcon());
        }

        return dto;
    }
}