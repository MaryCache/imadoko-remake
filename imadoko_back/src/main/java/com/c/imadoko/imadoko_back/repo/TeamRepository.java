package com.c.imadoko.imadoko_back.repo;

import com.c.imadoko.imadoko_back.domain.Team;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    boolean existsByTeamName(String teamName);
    Optional<Team> findByTeamName(String teamName);
    
    @EntityGraph(attributePaths = {"players"})
    @Override
    List<Team> findAll();
}
