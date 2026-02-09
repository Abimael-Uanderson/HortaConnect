package br.com.hortaconnect.api.client;

import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Component
public class PrecoDaHoraClient {
    private final HttpClient httpClient;
    private final String baseUrl = "https://precodahora.ba.gov.br";
    private String csrfToken = "";
    private String cookies = "";

    public PrecoDaHoraClient() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public void autenticar() throws IOException, InterruptedException {
        URI uri = URI.create(baseUrl + "/");
        HttpRequest getRequest = HttpRequest.newBuilder()
                .uri(uri)
                .header("User-Agent", "Mozilla/5.0")
                .build();

        HttpResponse<String> response = httpClient.send(getRequest, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();

        Document document = Jsoup.parse(responseBody);
        Element csrfElement = document.selectFirst("#validate");

        this.csrfToken = csrfElement != null ? csrfElement.attr("data-id") : "";
        this.cookies = response.headers().firstValue("Set-Cookie").orElse("");
    }

    public JSONObject post(String endpoint, Map<String, String> params) throws IOException, InterruptedException {
        if (this.csrfToken.isEmpty()) {
            autenticar();
        }

        URI uri = URI.create(baseUrl + endpoint);
        StringBuilder body = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (body.length() > 0) body.append("&");
            body.append(entry.getKey()).append("=").append(entry.getValue());
        }

        HttpRequest postRequest = HttpRequest.newBuilder()
                .uri(uri)
                .header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
                .header("X-CSRFToken", csrfToken)
                .header("Cookie", cookies)
                .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                .build();

        HttpResponse<String> response = httpClient.send(postRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 403) {
            this.csrfToken = "";
        }

        return new JSONObject(response.body());
    }
}