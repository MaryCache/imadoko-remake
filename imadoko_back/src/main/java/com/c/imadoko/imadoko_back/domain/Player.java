package com.c.imadoko.imadoko_back.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Player {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "名は必須です")
  @Size(max = 30, message = "名は30文字以内で入力してください")
  private String firstName;

  @NotBlank(message = "姓は必須です")
  @Size(max = 30, message = "姓は30文字以内で入力してください")
  private String lastName;

  @NotBlank(message = "ポジションは必須です")
  @Pattern(regexp = "^(S|WS|MB|OP|Li)$", message = "ポジションはS, WS, MB, OP, Liのいずれかを指定してください")
  private String position;

  public Player(String firstName, String lastName, String position) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
  }
}
