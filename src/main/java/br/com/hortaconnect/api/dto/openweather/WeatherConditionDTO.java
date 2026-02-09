package br.com.hortaconnect.api.dto.openweather;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherConditionDTO {
    private int id;
    private String main;
    private String description;

    private String icon;
}