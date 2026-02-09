package br.com.hortaconnect.api.client;
import br.com.hortaconnect.api.dto.openweather.GeoCodingDTO;
import br.com.hortaconnect.api.dto.openweather.WeatherResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class OpenWeatherClient {

    @Value("${OPENWEATHER_API_KEY}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // 1. Busca Previsão 7 Dias
    public WeatherResponseDTO buscarPrevisao7Dias(double lat, double lon) {
        String url = String.format(
                "https://api.openweathermap.org/data/3.0/onecall?lat=%s&lon=%s&exclude=minutely,hourly&units=metric&lang=pt_br&appid=%s",
                lat, lon, apiKey
        );
        try {
            return restTemplate.getForObject(url, WeatherResponseDTO.class);
        } catch (Exception e) {
            System.err.println("Erro Clima: " + e.getMessage());
            return null;
        }
    }

    // 2. Busca Coordenadas por Cidade (Plano B inteligente)
    public GeoCodingDTO buscarCoordenadas(String cidade, String estado) {
        String url = String.format(
                "http://api.openweathermap.org/geo/1.0/direct?q=%s,%s,BR&limit=1&appid=%s",
                cidade, estado, apiKey
        );
        try {
            GeoCodingDTO[] response = restTemplate.getForObject(url, GeoCodingDTO[].class);
            if (response != null && response.length > 0) return response[0];
        } catch (Exception e) {
            System.err.println("Erro Geo: " + e.getMessage());
        }
        return null;
    }
}