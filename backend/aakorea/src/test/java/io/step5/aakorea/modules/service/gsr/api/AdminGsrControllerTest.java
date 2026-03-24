package io.step5.aakorea.modules.service.gsr.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.step5.aakorea.modules.service.gsr.infrastructure.GSRRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminGsrControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GSRRepository gsrRepository;

    @BeforeEach
    void setUp() {
        gsrRepository.deleteAll();
    }

    @Test
    void supportsBasicCrud() throws Exception {
        mockMvc.perform(post("/api/admin/gsrs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminGsrRequest("Volunteer Kim", "010", "1 Seoul-ro", "a@example.org"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nickname").value("Volunteer Kim"));

        Long gsrId = gsrRepository.findByEmail("a@example.org").orElseThrow().getId();

        mockMvc.perform(put("/api/admin/gsrs/{gsrId}", gsrId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminGsrRequest("Volunteer Lee", "011", "2 Seoul-ro", "b@example.org"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("Volunteer Lee"));

        mockMvc.perform(get("/api/admin/gsrs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gsrs", hasSize(1)));

        mockMvc.perform(delete("/api/admin/gsrs/{gsrId}", gsrId))
                .andExpect(status().isNoContent());
    }
}