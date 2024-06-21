package com.sap.extensionmodules.exception;

import java.util.List;

public class CustomValidationException extends RuntimeException{
    private final int code;
    private final String message;
    private final List<ErrorResponse.ErrorInfo> details;
    public CustomValidationException(int code, String message, List<ErrorResponse.ErrorInfo> details) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
    public String getMessage() {return message;}

    public int getCode() {
        return code;
    }

    public List<ErrorResponse.ErrorInfo> getDetails() {
        return details;
    }


    @Override
    public String toString() {
        return "CustomValidationException{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", details=" + details +
                '}';
    }
}
