package com.c.imadoko.common.exception;

import lombok.Getter;

@Getter
public class ImadokoException extends RuntimeException {
    private final ErrorCode errorCode;

    public ImadokoException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
