package com.farmacia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    @Value("${auth.login.max-attempts:5}")
    private int maxAttempts;

    @Value("${auth.login.block-ms:900000}")
    private long blockMs;

    public boolean bloqueado(String username, String ip) {
        Attempt attempt = attempts.get(chave(username, ip));
        if (attempt == null) {
            return false;
        }
        if (attempt.blockedUntil == null) {
            return false;
        }
        if (attempt.blockedUntil.isAfter(Instant.now())) {
            return true;
        }
        attempts.remove(chave(username, ip));
        return false;
    }

    public void registrarFalha(String username, String ip) {
        attempts.compute(chave(username, ip), (key, atual) -> {
            Attempt attempt = atual == null ? new Attempt() : atual;
            attempt.count++;
            if (attempt.count >= maxAttempts) {
                attempt.blockedUntil = Instant.now().plus(Duration.ofMillis(blockMs));
            }
            return attempt;
        });
    }

    public void registrarSucesso(String username, String ip) {
        attempts.remove(chave(username, ip));
    }

    private String chave(String username, String ip) {
        String usuario = username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
        return usuario + "|" + ip;
    }

    private static class Attempt {
        private int count;
        private Instant blockedUntil;
    }
}
