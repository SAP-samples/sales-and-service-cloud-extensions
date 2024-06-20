package com.sap.extensionmodules.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class CustomException extends RuntimeException{
    private final int code;
    private final String message;

    public CustomException(int code, String message) {
        this.code = code;
        this.message = message;
    }


    @Override
    public String getMessage() {
        return message;
    }
}
