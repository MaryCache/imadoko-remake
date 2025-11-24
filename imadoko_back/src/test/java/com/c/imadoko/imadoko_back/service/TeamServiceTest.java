package com.c.imadoko.imadoko_back.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.c.imadoko.imadoko_back.api.dto.PlayerRequest;
import com.c.imadoko.imadoko_back.api.dto.TeamRequest;
import com.c.imadoko.imadoko_back.domain.Player;
import com.c.imadoko.imadoko_back.domain.Team;
import com.c.imadoko.imadoko_back.repo.TeamRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/** TeamServiceのテスト @ExtendWith(MockitoExtension.class)を使用してモックベースのテスト 実際のDBには接続せず、ビジネスロジックのみをテスト */
@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

  @Mock private TeamRepository teamRepository;

  @InjectMocks private TeamService teamService;

  private TeamRequest testTeamRequest;
  private Team testTeam;

  @BeforeEach
  void setUp() {
    // テストデータの準備
    PlayerRequest playerRequest = new PlayerRequest("Taro", "Yamada", "WS");
    testTeamRequest = new TeamRequest("Test Team", List.of(playerRequest));

    testTeam = new Team();
    testTeam.setId(1L);
    testTeam.setTeamName("Test Team");

    Player player = new Player();
    player.setId(1L);
    player.setFirstName("Taro");
    player.setLastName("Yamada");
    player.setPosition("WS");

    // 可変リストを使用（update()メソッドでclear()が呼ばれるため）
    testTeam.setPlayers(new ArrayList<>(List.of(player)));
  }

  @Test
  void 全チームを取得できる() {
    // Given: モックの設定
    when(teamRepository.findAll()).thenReturn(List.of(testTeam));

    // When: 全チームを取得
    List<Team> teams = teamService.findAll();

    // Then: 結果を検証
    assertThat(teams).hasSize(1);
    assertThat(teams.get(0).getTeamName()).isEqualTo("Test Team");
    verify(teamRepository, times(1)).findAll();
  }

  @Test
  void IDでチームを取得できる() {
    // Given: モックの設定
    when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));

    // When: IDでチームを取得
    Team team = teamService.findById(1L);

    // Then: 結果を検証
    assertThat(team.getTeamName()).isEqualTo("Test Team");
    assertThat(team.getPlayers()).hasSize(1);
    verify(teamRepository, times(1)).findById(1L);
  }

  @Test
  void 存在しないIDでチームを取得すると例外が発生する() {
    // Given: モックの設定（チームが見つからない）
    when(teamRepository.findById(999L)).thenReturn(Optional.empty());

    // When & Then: 例外が発生することを確認
    assertThatThrownBy(() -> teamService.findById(999L))
        .isInstanceOf(EntityNotFoundException.class)
        .hasMessageContaining("Team not found");

    verify(teamRepository, times(1)).findById(999L);
  }

  @Test
  void チームを作成できる() {
    // Given: モックの設定
    when(teamRepository.existsByTeamName(any())).thenReturn(false);
    when(teamRepository.save(any(Team.class))).thenReturn(testTeam);

    // When: チームを作成
    Team createdTeam = teamService.create(testTeamRequest);

    // Then: 結果を検証
    assertThat(createdTeam.getTeamName()).isEqualTo("Test Team");
    assertThat(createdTeam.getPlayers()).hasSize(1);
    verify(teamRepository, times(1)).save(any(Team.class));
  }

  @Test
  void チームを更新できる() {
    // Given: モックの設定
    when(teamRepository.findById(1L)).thenReturn(Optional.of(testTeam));
    when(teamRepository.existsByTeamName(any())).thenReturn(false);
    when(teamRepository.save(any(Team.class))).thenReturn(testTeam);

    PlayerRequest updatedPlayerRequest = new PlayerRequest("Jiro", "Sato", "MB");
    TeamRequest updatedRequest = new TeamRequest("Updated Team", List.of(updatedPlayerRequest));

    // When: チームを更新
    Team updatedTeam = teamService.update(1L, updatedRequest);

    // Then: 結果を検証
    assertThat(updatedTeam).isNotNull();
    verify(teamRepository, times(1)).findById(1L);
    verify(teamRepository, times(1)).save(any(Team.class));
  }

  @Test
  void チームを削除できる() {
    // Given: モックの設定
    when(teamRepository.existsById(1L)).thenReturn(true);
    doNothing().when(teamRepository).deleteById(1L);

    // When: チームを削除
    teamService.delete(1L);

    // Then: 削除メソッドが呼ばれたことを確認
    verify(teamRepository, times(1)).existsById(1L);
    verify(teamRepository, times(1)).deleteById(1L);
  }

  @Test
  void 存在しないチームを削除しようとすると例外が発生する() {
    // Given: モックの設定（チームが存在しない）
    when(teamRepository.existsById(999L)).thenReturn(false);

    // When & Then: 例外が発生することを確認
    assertThatThrownBy(() -> teamService.delete(999L))
        .isInstanceOf(EntityNotFoundException.class)
        .hasMessageContaining("Team not found");

    verify(teamRepository, times(1)).existsById(999L);
    verify(teamRepository, never()).deleteById(any());
  }
}
