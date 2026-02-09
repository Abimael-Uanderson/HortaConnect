package br.com.hortaconnect.api.client;
import br.com.hortaconnect.api.dto.brasilapi.BrasilApiResponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class BrasilApiClient {
    private final RestTemplate restTemplate = new RestTemplate();

    public BrasilApiResponseDTO buscarCep(String cep) {
        String url = "https://brasilapi.com.br/api/cep/v2/" + cep.replaceAll("\\D", "");
        try {
            return restTemplate.getForObject(url, BrasilApiResponseDTO.class);
        } catch (Exception e) {
            return null;
        }
    }
}