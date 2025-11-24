package com.c.imadoko.imadoko_back.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PlayerRequest(
    @NotBlank(message = "名は必須です") @Size(max = 30, message = "名は30文字以内で入力してください") String firstName,
    @NotBlank(message = "姓は必須です") @Size(max = 30, message = "姓は30文字以内で入力してください") String lastName,
    @NotBlank(message = "ポジションは必須です")
        @Pattern(regexp = "^(S|WS|MB|OP|Li)$", message = "ポジションはS, WS, MB, OP, Liのいずれかを指定してください")
        String position) {}
