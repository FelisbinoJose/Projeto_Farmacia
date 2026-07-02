package com.farmacia.service;

import com.farmacia.model.RefreshToken;
import com.farmacia.model.Usuario;
import com.farmacia.repository.RefreshTokenRepository;
import com.farmacia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UsuarioRepository usuarioRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public String criarRefreshToken(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

        String token = gerarTokenAleatorio();
        RefreshToken refreshToken = new RefreshToken(
                usuario,
                hashToken(token),
                Instant.now().plusMillis(refreshExpirationMs)
        );

        refreshTokenRepository.save(refreshToken);
        return token;
    }

    @Transactional
    public RefreshResult rotacionar(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hashToken(token))
                .orElseThrow(() -> new IllegalArgumentException("Refresh token invalido."));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new IllegalArgumentException("Refresh token invalido.");
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        String novoRefreshToken = criarRefreshToken(refreshToken.getUsuario().getUsername());
        return new RefreshResult(refreshToken.getUsuario().getUsername(), novoRefreshToken);
    }

    @Transactional
    public void revogar(String token) {
        refreshTokenRepository.findByTokenHash(hashToken(token))
                .ifPresent(refreshToken -> {
                    refreshToken.setRevoked(true);
                    refreshTokenRepository.save(refreshToken);
                });
    }

    private String gerarTokenAleatorio() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 indisponivel.", e);
        }
    }

    public record RefreshResult(String username, String refreshToken) {
    }
}
