package br.com.meveum.shared.exception;

import java.time.OffsetDateTime;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErroResponse tratarRecursoNaoEncontrado(RecursoNaoEncontradoException exception) {
        return new ErroResponse(exception.getMessage(), OffsetDateTime.now());
    }

    @ExceptionHandler(RegraNegocioException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErroResponse tratarRegraNegocio(RegraNegocioException exception) {
        return new ErroResponse(exception.getMessage(), OffsetDateTime.now());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErroResponse tratarValidacao(MethodArgumentNotValidException exception) {
        var mensagem = exception.getBindingResult()
            .getFieldErrors()
            .stream()
            .findFirst()
            .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
            .orElse("Requisicao invalida.");

        return new ErroResponse(mensagem, OffsetDateTime.now());
    }

    @ExceptionHandler(NaoAutorizadoException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErroResponse tratarNaoAutorizado(NaoAutorizadoException exception) {
        return new ErroResponse(exception.getMessage(), OffsetDateTime.now());
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErroResponse tratarAuthentication(AuthenticationException exception) {
        return new ErroResponse("Autenticacao obrigatoria.", OffsetDateTime.now());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErroResponse tratarAccessDenied(AccessDeniedException exception) {
        return new ErroResponse("Acesso negado.", OffsetDateTime.now());
    }
}
