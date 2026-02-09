package br.com.hortaconnect.api.dto.openweather;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrentWeatherDTO {
    private long dt;
    private double temp;
    private double feels_like; // Sensação térmica
    private double humidity;
    private double wind_speed;
    private List<WeatherConditionDTO> weather; // Ícone e descrição
}