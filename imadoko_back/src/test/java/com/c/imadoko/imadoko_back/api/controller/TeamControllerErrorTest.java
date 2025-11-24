package com.c.imadoko.imadoko_back.api.controller;

import com.c.imadoko.common.exception.ErrorCode;
import com.c.imadoko.common.exception.GlobalExceptionHandler;
import com.c.imadoko.common.exception.ImadokoException;
import com.c.imadoko.imadoko_back.api.dto.TeamRequest;
import com.c.imadoko.imadoko_back.service.TeamService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TeamController.class)
@Import(GlobalExceptionHandler.class)
public class TeamControllerErrorTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeamService teamService;

    @Autowired
    private ObjectMapper objectMapper;

    private TeamRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new TeamRequest("Test Team", Collections.emptyList());
    }

    @Test
    void createTeam_DuplicateName_ShouldReturnConflict_E102() throws Exception {
        when(teamService.create(any(TeamRequest.class)))
                .thenThrow(new ImadokoException(ErrorCode.DUPLICATE_TEAM_NAME));

        mockMvc.perform(post("/api/teams")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("E102"))
                .andExpect(jsonPath("$.message").value("そのチーム名は既に使用されています"));
    }

    @Test
    void getTeam_NotFound_ShouldReturnNotFound_E101() throws Exception {
        when(teamService.findById(999L))
                .thenThrow(new ImadokoException(ErrorCode.TEAM_NOT_FOUND));

        mockMvc.perform(get("/api/teams/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("E101"))
                .andExpect(jsonPath("$.message").value("指定されたチームが見つかりません"));
    }

    @Test
    void createTeam_InvalidRequest_ShouldReturnBadRequest_E400() throws Exception {
        // Empty team name to trigger validation error
        TeamRequest invalidRequest = new TeamRequest("", Collections.emptyList());

        mockMvc.perform(post("/api/teams")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("E400"))
                .andExpect(jsonPath("$.message").value("入力内容に誤りがあります"))
                .andExpect(jsonPath("$.details").isArray())
                .andExpect(jsonPath("$.details").isNotEmpty());
    }
}
