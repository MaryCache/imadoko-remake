package com.c.imadoko.common.exception;

import com.c.imadoko.common.api.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ImadokoException.class)
    public ResponseEntity<ErrorResponse> handleImadokoException(ImadokoException ex) {
        ErrorCode ec = ex.getErrorCode();
        // 業務例外はWARNレベルでログ出力（必要に応じてINFO/ERROR調整）
        log.warn("Business exception occurred: code={}, message={}", ec.getCode(), ec.getMessage());

        return ResponseEntity
                .status(ec.getStatus())
                .body(ErrorResponse.of(ec.getCode(), ec.getMessage(), List.of()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        ErrorCode ec = ErrorCode.INVALID_REQUEST;
        log.warn("Validation error: {}", details);

        return ResponseEntity
                .status(ec.getStatus())
                .body(ErrorResponse.of(ec.getCode(), "入力内容に誤りがあります", details));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        // 予期せぬエラーはERRORレベルでスタックトレースを出力
        log.error("Unexpected error occurred", ex);

        ErrorCode ec = ErrorCode.INTERNAL_SERVER_ERROR;
        return ResponseEntity
                .status(ec.getStatus())
                .body(ErrorResponse.of(ec.getCode(), ec.getMessage(), List.of(ex.getMessage())));
    }
}
