package io.step5.aakorea.controller.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.step5.aakorea.dto.admin.AdminGsrRequest;
import io.step5.aakorea.repository.GSRRepository;
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
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    GSRRepository gsrRepository;

    @BeforeEach
    void setUp() {
        gsrRepository.deleteAll();
    }

    @Test
    void gsr를_CRUD_할_수_있다() throws Exception {
        mockMvc.perform(post("/api/admin/gsrs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminGsrRequest("봉사자A", "010", "a@example.org"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nickname").value("봉사자A"));

        Long gsrId = gsrRepository.findByEmail("a@example.org").orElseThrow().getId();

        mockMvc.perform(put("/api/admin/gsrs/{gsrId}", gsrId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AdminGsrRequest("봉사자B", "011", "b@example.org"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("봉사자B"));

        mockMvc.perform(get("/api/admin/gsrs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gsrs", hasSize(1)));

        mockMvc.perform(delete("/api/admin/gsrs/{gsrId}", gsrId))
                .andExpect(status().isNoContent());
    }
}
