package project1.project1_spring.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class RegionService {
    private Map<String, Map<String, List<String>>> regionData;

    @PostConstruct
    public void init() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = getClass().getResourceAsStream("/static/data/regions.json");
        regionData = mapper.readValue(is, new TypeReference<>() {});
    }

    public Set<String> getSidoList() {

        return regionData.keySet();
    }

    public Set<String> getGugunList(String sido) {
        Map<String, List<String>> gugunMap = regionData.get(sido);
        return gugunMap != null ? gugunMap.keySet() : Collections.emptySet();
    }

    public List<String> getDongList(String sido, String gugun) {
        Map<String, List<String>> gugunMap = regionData.get(sido);
        return (gugunMap != null) ? gugunMap.getOrDefault(gugun, Collections.emptyList()) : Collections.emptyList();
    }
}
