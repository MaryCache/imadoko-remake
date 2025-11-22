package com.c.imadoko.imadoko_back.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record TeamRequest(
        @NotBlank(message = "チーム名は必須です")
        @Size(max = 50, message = "チーム名は50文字以内で入力してください")
        String teamName,

        @Valid
        @Size(max = 14, message = "選手は最大14人まで登録できます")
        List<PlayerRequest> players) {
}
