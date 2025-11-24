package com.c.imadoko.imadoko_back.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.c.imadoko.imadoko_back.api.dto.PlayerRequest;
import com.c.imadoko.imadoko_back.api.dto.TeamRequest;
import com.c.imadoko.imadoko_back.domain.Player;
import com.c.imadoko.imadoko_back.domain.Team;
import com.c.imadoko.imadoko_back.service.TeamService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** TeamControllerのテスト @WebMvcTestを使用してREST APIエンドポイントをテスト サービス層はモック化し、コントローラーの動作のみをテスト */
@WebMvcTest(TeamController.class)
class TeamControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockBean private TeamService teamService;

  private Team testTeam;
  private TeamRequest testTeamRequest;

  @BeforeEach
  void setUp() {
    // テストデータの準備
    testTeam = new Team();
    testTeam.setId(1L);
    testTeam.setTeamName("Test Team");

    Player player = new Player();
    player.setId(1L);
    player.setFirstName("Taro");
    player.setLastName("Yamada");
    player.setPosition("WS");

    testTeam.setPlayers(List.of(player));

    PlayerRequest playerRequest = new PlayerRequest("Taro", "Yamada", "WS");
    testTeamRequest = new TeamRequest("Test Team", List.of(playerRequest));
  }

  @Test
  void GET_api_teams_で全チームを取得できる() throws Exception {
    // Given: モックの設定
    when(teamService.findAll()).thenReturn(List.of(testTeam));

    // When & Then: APIを呼び出して結果を検証
    mockMvc
        .perform(get("/api/teams"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$[0].teamName").value("Test Team"))
        .andExpect(jsonPath("$[0].players[0].firstName").value("Taro"));

    verify(teamService, times(1)).findAll();
  }

  @Test
  void GET_api_teams_id_で特定のチームを取得できる() throws Exception {
    // Given: モックの設定
    when(teamService.findById(1L)).thenReturn(testTeam);

    // When & Then: APIを呼び出して結果を検証
    mockMvc
        .perform(get("/api/teams/1"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.teamName").value("Test Team"))
        .andExpect(jsonPath("$.players").isArray());

    verify(teamService, times(1)).findById(1L);
  }

  @Test
  void GET_api_teams_id_で存在しないIDを指定すると404が返る() throws Exception {
    // Given: モックの設定（チームが見つからない）
    when(teamService.findById(999L))
        .thenThrow(new EntityNotFoundException("Team not found with id: 999"));

    // When & Then: 404エラーが返ることを確認
    mockMvc.perform(get("/api/teams/999")).andExpect(status().isNotFound());

    verify(teamService, times(1)).findById(999L);
  }

  @Test
  void POST_api_teams_でチームを作成できる() throws Exception {
    // Given: モックの設定
    when(teamService.create(any(TeamRequest.class))).thenReturn(testTeam);

    // When & Then: APIを呼び出して結果を検証
    mockMvc
        .perform(
            post("/api/teams")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTeamRequest)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.teamName").value("Test Team"));

    verify(teamService, times(1)).create(any(TeamRequest.class));
  }

  @Test
  void PUT_api_teams_id_でチームを更新できる() throws Exception {
    // Given: モックの設定
    when(teamService.update(eq(1L), any(TeamRequest.class))).thenReturn(testTeam);

    // When & Then: APIを呼び出して結果を検証
    mockMvc
        .perform(
            put("/api/teams/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testTeamRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.teamName").value("Test Team"));

    verify(teamService, times(1)).update(eq(1L), any(TeamRequest.class));
  }

  @Test
  void DELETE_api_teams_id_でチームを削除できる() throws Exception {
    // Given: モックの設定
    doNothing().when(teamService).delete(1L);

    // When & Then: APIを呼び出して結果を検証
    mockMvc.perform(delete("/api/teams/1")).andExpect(status().isNoContent());

    verify(teamService, times(1)).delete(1L);
  }

  @Test
  void POST_api_teams_でバリデーションエラーがあると400が返る() throws Exception {
    // Given: 不正なリクエスト（チーム名が空）
    TeamRequest invalidRequest = new TeamRequest("", List.of());

    // When & Then: 400エラーが返ることを確認
    mockMvc
        .perform(
            post("/api/teams")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
        .andExpect(status().isBadRequest());

    verify(teamService, never()).create(any());
  }
}
