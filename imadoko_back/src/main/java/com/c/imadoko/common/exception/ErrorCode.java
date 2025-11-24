package com.c.imadoko.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    INTERNAL_SERVER_ERROR("E999", "予期せぬエラーが発生しました", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST("E400", "リクエストが不正です", HttpStatus.BAD_REQUEST),

    TEAM_NOT_FOUND("E101", "指定されたチームが見つかりません", HttpStatus.NOT_FOUND),
    DUPLICATE_TEAM_NAME("E102", "そのチーム名は既に使用されています", HttpStatus.CONFLICT);

    private final String code;
    private final String message;
    private final HttpStatus status;
}
