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

    // ✅ MUDANÇA 1: Cron setado para 06:00 da manhã (Produção)
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
        // 1. GARANTE COORDENADAS (Fluxo Inteligente)
        if (usuario.getLatitude() == null || usuario.getLongitude() == null) {
            atualizarCoordenadas(usuario); // Refatorei para um método auxiliar para reusar
        }

        // Se mesmo tentando atualizar, continuar null, desiste
        if (usuario.getLatitude() == null) return;

        // 2. BUSCA PREVISÃO DO TEMPO
        WeatherResponseDTO clima = weatherClient.buscarPrevisao7Dias(usuario.getLatitude(), usuario.getLongitude());

        if (clima != null && clima.getDaily() != null) {
            clima.getDaily().forEach(dia -> analisarDia(dia, usuario));
        }
    }

    // Método auxiliar para buscar Lat/Lon se estiver faltando
    private void atualizarCoordenadas(Usuario usuario) {
        BrasilApiResponseDTO endereco = brasilApiClient.buscarCep(usuario.getCep());

        if (endereco != null && endereco.getCity() != null) {
            GeoCodingDTO geo = weatherClient.buscarCoordenadas(endereco.getCity(), endereco.getState());

            if (geo != null) {
                usuario.setLatitude(geo.getLat());
                usuario.setLongitude(geo.getLon());
                usuario.setCidade(endereco.getCity());
                usuario.setEstado(endereco.getState());
                usuarioRepository.save(usuario);
            }
        }
    }

    private void analisarDia(DailyForecastDTO dia, Usuario usuario) {
        LocalDate data = Instant.ofEpochSecond(dia.getDt()).atZone(ZoneId.systemDefault()).toLocalDate();
        if (data.isBefore(LocalDate.now())) return; // Ignora passado

        double chuva = (dia.getRain() != null) ? dia.getRain() : 0.0;
        int weatherId = dia.getWeather().get(0).getId();

        // ✅ MUDANÇA 2: Limites ajustados para a vida real

        // 1. Chuva Forte (> 20mm)
        if (chuva > 20.0 || (weatherId >= 200 && weatherId < 300)) {
            alertaService.criarAlertaSeNaoExistir(usuario, TipoAlerta.CHUVA_FORTE,
                    "Tempestade/Chuva forte (" + String.format("%.1f", chuva) + "mm) prevista.", data.atStartOfDay());
        }

        // 2. Calor Extremo (> 35°C)
        if (dia.getTemp().getMax() > 35.0) {
            alertaService.criarAlertaSeNaoExistir(usuario, TipoAlerta.CALOR_INTENSO,
                    "Calor extremo (" + dia.getTemp().getMax() + "°C). Hidrate a horta.", data.atStartOfDay());
        }

        // 3. Geada (< 4°C)
        if (dia.getTemp().getMin() < 4.0) {
            alertaService.criarAlertaSeNaoExistir(usuario, TipoAlerta.GEADA,
                    "Risco de Geada (" + dia.getTemp().getMin() + "°C). Proteja as mudas.", data.atStartOfDay());
        }
    }

    public ClimaAtualResponseDTO obterClimaAtualDoUsuarioLogado() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // ✅ MUDANÇA 3: Auto-recuperação
        // Se o usuário acabou de entrar e não tem Lat/Lon, busca agora em vez de dar erro
        if (usuario.getLatitude() == null || usuario.getLongitude() == null) {
            atualizarCoordenadas(usuario);

            // Se ainda assim for null (CEP inválido), aí sim lança erro
            if (usuario.getLatitude() == null) {
                throw new RuntimeException("Endereço não localizado. Verifique seu CEP.");
            }
        }

        // 2. Busca na API
        WeatherResponseDTO clima = weatherClient.buscarPrevisao7Dias(usuario.getLatitude(), usuario.getLongitude());

        if (clima == null || clima.getCurrent() == null) {
            throw new RuntimeException("Serviço de clima indisponível no momento.");
        }

        // 3. Monta a resposta bonita pro Front
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