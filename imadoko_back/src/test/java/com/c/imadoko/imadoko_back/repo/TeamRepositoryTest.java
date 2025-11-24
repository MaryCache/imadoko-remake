package com.c.imadoko.imadoko_back.repo;

import static org.assertj.core.api.Assertions.assertThat;

import com.c.imadoko.imadoko_back.domain.Player;
import com.c.imadoko.imadoko_back.domain.Team;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

/** TeamRepositoryのテスト @DataJpaTestを使用してJPAの動作のみをテスト 実際のDBには影響せず、H2インメモリDBを使用 */
@DataJpaTest
class TeamRepositoryTest {

  @Autowired private TeamRepository teamRepository;

  @Autowired private TestEntityManager entityManager;

  @Test
  void チームを保存できる() {
    // Given: テストデータ作成
    Team team = new Team();
    team.setTeamName("Test Team");

    Player player = new Player();
    player.setFirstName("Taro");
    player.setLastName("Yamada");
    player.setPosition("WS");

    team.setPlayers(List.of(player));

    // When: チームを保存
    Team savedTeam = teamRepository.save(team);
    entityManager.flush();

    // Then: 保存されたことを確認
    assertThat(savedTeam.getId()).isNotNull();
    assertThat(savedTeam.getTeamName()).isEqualTo("Test Team");
    assertThat(savedTeam.getPlayers()).hasSize(1);
  }

  @Test
  void IDでチームを検索できる() {
    // Given: テストデータを事前に保存
    Team team = new Team();
    team.setTeamName("Search Test Team");
    team.setPlayers(List.of());

    Team savedTeam = entityManager.persist(team);
    entityManager.flush();

    // When: IDで検索
    Optional<Team> found = teamRepository.findById(savedTeam.getId());

    // Then: 見つかることを確認
    assertThat(found).isPresent();
    assertThat(found.get().getTeamName()).isEqualTo("Search Test Team");
  }

  @Test
  void 全チームを取得できる() {
    // Given: 複数のチームを保存
    Team team1 = new Team();
    team1.setTeamName("Team 1");
    team1.setPlayers(List.of());

    Team team2 = new Team();
    team2.setTeamName("Team 2");
    team2.setPlayers(List.of());

    entityManager.persist(team1);
    entityManager.persist(team2);
    entityManager.flush();

    // When: 全チームを取得
    List<Team> teams = teamRepository.findAll();

    // Then: 2つ以上のチームが取得できることを確認
    assertThat(teams).hasSizeGreaterThanOrEqualTo(2);
  }

  @Test
  void チームを削除できる() {
    // Given: テストデータを保存
    Team team = new Team();
    team.setTeamName("Delete Test Team");
    team.setPlayers(List.of());

    Team savedTeam = entityManager.persist(team);
    entityManager.flush();
    Long teamId = savedTeam.getId();

    // When: チームを削除
    teamRepository.deleteById(teamId);
    entityManager.flush();

    // Then: 削除されたことを確認
    Optional<Team> found = teamRepository.findById(teamId);
    assertThat(found).isEmpty();
  }
}
