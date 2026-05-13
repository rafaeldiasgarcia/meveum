package br.com.meveum.auth.dto;

import lombok.Builder;

@Builder
public record ObterUrlOAuthResponse(
    String provedor,
    String authorizationUrl
) {
}
