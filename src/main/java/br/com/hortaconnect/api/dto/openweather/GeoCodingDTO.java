package br.com.hortaconnect.api.dto.openweather;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeoCodingDTO {
    private String name;
    private Double lat;
    private Double lon;
    private String state;
}