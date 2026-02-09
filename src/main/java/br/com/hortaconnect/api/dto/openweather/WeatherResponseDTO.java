package br.com.hortaconnect.api.dto.openweather;
import lombok.Data;
import java.util.List;

@Data
public class WeatherResponseDTO {
    private CurrentWeatherDTO current;
    private List<DailyForecastDTO> daily;
}