package br.com.hortaconnect.api.dto.openweather;
import lombok.Data;
import java.util.List;

@Data
public class DailyForecastDTO {
    private long dt;
    private TempDTO temp;
    private Double rain;
    private List<WeatherConditionDTO> weather;
}