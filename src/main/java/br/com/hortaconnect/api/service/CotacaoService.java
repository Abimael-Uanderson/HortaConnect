package br.com.hortaconnect.api.service;

import br.com.hortaconnect.api.client.PrecoDaHoraClient;
import br.com.hortaconnect.api.dto.ProdutoCotacaoDTO;
import br.com.hortaconnect.api.entity.Usuario;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CotacaoService {

    private final PrecoDaHoraClient client;

    public CotacaoService(PrecoDaHoraClient client) {
        this.client = client;
    }

    public List<ProdutoCotacaoDTO> buscarMelhorPreco(String termo) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String lat = (usuario.getLatitude() != null) ? usuario.getLatitude().toString() : "-12.9714";
        String lon = (usuario.getLongitude() != null) ? usuario.getLongitude().toString() : "-38.5014";

        try {
            String gtin = obterGtin(termo);
            if (gtin == null) return new ArrayList<>();

            return buscarProdutosPorGtin(gtin, lat, lon);

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private String obterGtin(String termo) throws Exception {
        Map<String, String> params = new HashMap<>();
        params.put("item", termo);

        JSONObject json = client.post("/sugestao/", params);

        if (json.has("resultado")) {
            JSONArray resultados = json.getJSONArray("resultado");
            if (resultados.length() > 0) {
                for (int i = 0; i < resultados.length(); i++) {
                    JSONObject prod = resultados.getJSONObject(i);
                    long gtin = prod.optLong("gtin", 0);
                    if (gtin > 0) {
                        return String.valueOf(gtin);
                    }
                }
            }
        }
        return null;
    }

    private List<ProdutoCotacaoDTO> buscarProdutosPorGtin(String gtin, String lat, String lon) throws Exception {
        Map<String, String> params = new HashMap<>();
        params.put("gtin", gtin);
        params.put("horas", "72");
        params.put("latitude", lat);
        params.put("longitude", lon);
        params.put("raio", "15");
        params.put("precomax", "0");
        params.put("precomin", "0");
        params.put("ordenar", "preco.asc");
        params.put("pagina", "1");
        params.put("processo", "carregar");

        JSONObject json = client.post("/produtos/", params);
        List<ProdutoCotacaoDTO> lista = new ArrayList<>();

        if (json.has("resultado")) {
            JSONArray itens = json.getJSONArray("resultado");

            for (int i = 0; i < itens.length(); i++) {
                JSONObject item = itens.getJSONObject(i);

                JSONObject prod = item.optJSONObject("produto");
                JSONObject est = item.optJSONObject("estabelecimento");

                String nomeProduto = (prod != null) ? prod.optString("descricao") : "Produto Sem Nome";
                double preco = (prod != null) ? prod.optDouble("precoUnitario", 0.0) : 0.0;
                String dataVenda = (prod != null) ? prod.optString("data") : "";

                String nomeLoja = (est != null) ? est.optString("nomeEstabelecimento") : "Desconhecido";
                String bairroLoja = (est != null) ? est.optString("bairro") : "";

                String rua = (est != null) ? est.optString("endLogradouro") : "";
                String num = (est != null) ? est.optString("endNumero") : "";

                Double latitudeLoja = (est != null) ? est.optDouble("latitude") : null;
                Double longitudeLoja = (est != null) ? est.optDouble("longitude") : null;

                ProdutoCotacaoDTO dto = ProdutoCotacaoDTO.builder()
                        .nome(nomeProduto)
                        .preco(String.format("R$ %.2f", preco))
                        .estabelecimento(nomeLoja)
                        .bairro(bairroLoja)
                        .logradouro(rua)
                        .numero(num)
                        .dataHora(dataVenda)
                        .latitude(latitudeLoja)
                        .longitude(longitudeLoja)
                        .build();

                lista.add(dto);
            }
        }
        return lista;
    }
}