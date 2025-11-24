package com.c.imadoko.imadoko_back.service;

import com.c.imadoko.common.exception.ErrorCode;
import com.c.imadoko.common.exception.ImadokoException;
import com.c.imadoko.imadoko_back.api.dto.PlayerRequest;
import com.c.imadoko.imadoko_back.api.dto.TeamRequest;
import com.c.imadoko.imadoko_back.domain.Player;
import com.c.imadoko.imadoko_back.domain.Team;
import com.c.imadoko.imadoko_back.repo.TeamRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TeamService {

  private final TeamRepository teamRepository;

  public List<Team> findAll() {
    return teamRepository.findAll();
  }

  public Team findById(Long id) {
    return teamRepository
        .findById(id)
        .orElseThrow(() -> new ImadokoException(ErrorCode.TEAM_NOT_FOUND));
  }

  public Team create(TeamRequest request) {
    if (teamRepository.existsByTeamName(request.teamName())) {
      throw new ImadokoException(ErrorCode.DUPLICATE_TEAM_NAME);
    }

    Team team = new Team(request.teamName());
    List<Player> players = request.players().stream().map(this::toEntity).collect(Collectors.toList());

    // Limit to 14 players if necessary, though spec says "can register up to 14",
    // usually means UI restriction, but good to enforce here or just allow list.
    // Spec: "選手は十四名まで登録可能"
    if (players.size() > 14) {
      throw new ImadokoException(ErrorCode.INVALID_REQUEST);
    }

    team.setPlayers(players);
    return teamRepository.save(team);
  }

  public Team update(Long id, TeamRequest request) {
    Team team = findById(id);

    // Check name uniqueness if changed
    if (!team.getTeamName().equals(request.teamName())
        && teamRepository.existsByTeamName(request.teamName())) {
      throw new ImadokoException(ErrorCode.DUPLICATE_TEAM_NAME);
    }

    team.setTeamName(request.teamName());

    // Replace players
    team.getPlayers().clear();
    List<Player> newPlayers = request.players().stream().map(this::toEntity).collect(Collectors.toList());

    if (newPlayers.size() > 14) {
      throw new ImadokoException(ErrorCode.INVALID_REQUEST);
    }

    team.getPlayers().addAll(newPlayers);

    return teamRepository.save(team);
  }

  public void delete(Long id) {
    if (!teamRepository.existsById(id)) {
      throw new ImadokoException(ErrorCode.TEAM_NOT_FOUND);
    }
    teamRepository.deleteById(id);
  }

  private Player toEntity(PlayerRequest dto) {
    return new Player(dto.firstName(), dto.lastName(), dto.position());
  }
}
