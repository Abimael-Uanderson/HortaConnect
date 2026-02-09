package br.com.hortaconnect.api.dto.openweather;
import lombok.Data;
import java.util.List;

@Data
public class DailyForecastDTO {
    private long dt; // Timestamp
    private TempDTO temp;
    private Double rain; // Pode ser nulo
    private List<WeatherConditionDTO> weather;
}