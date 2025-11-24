package com.c.imadoko.imadoko_back.api.controller;

import com.c.imadoko.imadoko_back.api.dto.TeamRequest;
import com.c.imadoko.imadoko_back.domain.Team;
import com.c.imadoko.imadoko_back.service.TeamService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
@RequiredArgsConstructor
public class TeamController {

  private final TeamService teamService;

  @GetMapping
  public ResponseEntity<List<Team>> getAllTeams() {
    return ResponseEntity.ok(teamService.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Team> getTeam(@PathVariable Long id) {
    return ResponseEntity.ok(teamService.findById(id));
  }

  @PostMapping
  public ResponseEntity<Team> createTeam(@Valid @RequestBody TeamRequest request) {
    Team created = teamService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Team> updateTeam(
      @PathVariable Long id, @Valid @RequestBody TeamRequest request) {
    return ResponseEntity.ok(teamService.update(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
    teamService.delete(id);
    return ResponseEntity.noContent().build();
  }

}
