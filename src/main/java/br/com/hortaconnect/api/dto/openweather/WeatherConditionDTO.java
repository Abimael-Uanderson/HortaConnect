package br.com.hortaconnect.api.dto.openweather;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherConditionDTO {
    private int id;             // Código numérico (ex: 500)
    private String main;        // Grupo principal (ex: "Rain")
    private String description; // Descrição (ex: "chuva leve")

    // 👇 ADICIONE ESTE CAMPO AQUI
    private String icon;        // Código do ícone (ex: "10d")
}