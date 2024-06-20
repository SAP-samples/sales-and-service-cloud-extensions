package com.sap.extensionmodules.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.itextpdf.text.DocumentException;
import com.sap.cloud.sdk.services.openapi.core.OpenApiRequestException;
import javassist.NotFoundException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.persistence.PersistenceException;
import java.io.IOException;
import java.rmi.ServerException;

@ControllerAdvice
public class VehicleServiceExceptionHandler {

    @ExceptionHandler({Exception.class})
    public ResponseEntity<?> handleException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    @ExceptionHandler({CustomException.class})
    public ResponseEntity<?> handleCustomException(CustomException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.FORBIDDEN.value(),
             ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(errorResponse);
    }
    @ExceptionHandler({ServerException.class})
    public ResponseEntity<?> handleServerException(ServerException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    @ExceptionHandler({CustomNotFoundException.class})
    public ResponseEntity<?> handleCustomNotFoundException(CustomNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(ex.getCode(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    @ExceptionHandler({OpenApiRequestException.class})
    public ResponseEntity<?> handleOpenApiRequestException(OpenApiRequestException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(),
                "Cannot read Case data");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    @ExceptionHandler({APIExceptionHandler.class})
    public ResponseEntity<?> handleAPIExceptionHandler(APIExceptionHandler ex) {
        ErrorResponse errorResponse = new ErrorResponse(ex.getHttpStatus().value(), ex.getMessage());
        return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
    }
    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    @ExceptionHandler({CustomValidationException.class})
    public ResponseEntity<?> handleCustomValidationException(CustomValidationException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),
                "Bad Request", ex.getDetails());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    @ExceptionHandler({JsonProcessingException.class})
    public ResponseEntity<?> handleJsonProcessingException(JsonProcessingException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    @ExceptionHandler({DocumentException.class})
    public ResponseEntity<?> handleDocumentException(DocumentException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    @ExceptionHandler({IOException.class})
    public ResponseEntity<?> handleIOException(IOException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.FORBIDDEN.value(),
                ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }
    @ExceptionHandler({PersistenceException.class})
    public ResponseEntity<?> handleConstraintViolationException(PersistenceException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.FORBIDDEN.value(),
                ex.getCause().getCause().getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }
    @ExceptionHandler({InvalidQueryParameterException.class})
    public ResponseEntity<?> handleInvalidQueryParameterException(InvalidQueryParameterException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.FORBIDDEN.value(),
                ex.getCause().getCause().getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

}
