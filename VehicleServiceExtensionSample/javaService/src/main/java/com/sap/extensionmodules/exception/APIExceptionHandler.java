package com.sap.extensionmodules.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class APIExceptionHandler extends RuntimeException {
    private final HttpStatus httpStatus;
    public APIExceptionHandler(HttpStatus httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }



    public static APIExceptionHandler preconditionRequired(String message) {
        return new APIExceptionHandler(HttpStatus.PRECONDITION_REQUIRED, message);
    }
    public static APIExceptionHandler preconditionFailed(String message) {
        return new APIExceptionHandler(HttpStatus.PRECONDITION_FAILED, message);
    }
}

