package com.c.imadoko.imadoko_back.config;

import com.c.imadoko.imadoko_back.domain.Player;
import com.c.imadoko.imadoko_back.domain.Team;
import com.c.imadoko.imadoko_back.repo.TeamRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

  private final TeamRepository teamRepository;

  @Bean
  @Profile("!test") // テスト環境では実行しない
  public CommandLineRunner initData() {
    return args -> {
      if (teamRepository.count() > 0) {
        System.out.println("Data already exists. Skipping seeding.");
        return;
      }

      System.out.println("Seeding initial data...");

      // Team 1: Karasuno
      Team karasuno = new Team("Karasuno High");
      karasuno.setPlayers(
          List.of(
              new Player("Shoyo", "Hinata", "MB"),
              new Player("Tobio", "Kageyama", "S"),
              new Player("Daichi", "Sawamura", "WS"),
              new Player("Koushi", "Sugawara", "S"),
              new Player("Ryunosuke", "Tanaka", "WS"),
              new Player("Asahi", "Azumane", "WS"),
              new Player("Yu", "Nishinoya", "Li"),
              new Player("Kei", "Tsukishima", "MB"),
              new Player("Tadashi", "Yamaguchi", "MB")));

      // Team 2: Nekoma
      Team nekoma = new Team("Nekoma High");
      nekoma.setPlayers(
          List.of(
              new Player("Tetsuro", "Kuroo", "MB"),
              new Player("Kenma", "Kozume", "S"),
              new Player("Morisuke", "Yaku", "Li"),
              new Player("Taketora", "Yamamoto", "WS"),
              new Player("Shohei", "Fukunaga", "WS"),
              new Player("So", "Inuoka", "MB"),
              new Player("Lev", "Haiba", "MB"),
              new Player("Yuki", "Shibayama", "Li")));

      teamRepository.saveAll(List.of(karasuno, nekoma));
      System.out.println("Data seeding completed: 2 teams created.");
    };
  }
}
