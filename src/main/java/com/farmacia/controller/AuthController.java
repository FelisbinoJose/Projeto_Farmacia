package com.farmacia.controller;

import com.farmacia.dto.AuthResponse;
import com.farmacia.dto.LoginRequest;
import com.farmacia.dto.LogoutRequest;
import com.farmacia.dto.RefreshTokenRequest;
import com.farmacia.dto.RegistroRequest;
import com.farmacia.model.Usuario;
import com.farmacia.security.JwtUtil;
import com.farmacia.service.LoginAttemptService;
import com.farmacia.service.RefreshTokenService;
import com.farmacia.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String REFRESH_COOKIE_NAME = "farmacia_refresh_token";

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final LoginAttemptService loginAttemptService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    @Value("${jwt.refresh-cookie-secure:true}")
    private boolean refreshCookieSecure;

    public AuthController(AuthenticationManager authenticationManager,
                          UsuarioService usuarioService,
                          LoginAttemptService loginAttemptService,
                          RefreshTokenService refreshTokenService,
                          JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.usuarioService = usuarioService;
        this.loginAttemptService = loginAttemptService;
        this.refreshTokenService = refreshTokenService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@Valid @RequestBody RegistroRequest request) {
        try {
            Usuario usuario = usuarioService.cadastrar(request.getUsername(), request.getSenha());
            return ResponseEntity.ok().body("Usuário '" + usuario.getUsername() + "' cadastrado com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        if (loginAttemptService.bloqueado(request.getUsername(), ip)) {
            return ResponseEntity.status(429).body("Muitas tentativas de login. Tente novamente mais tarde.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getSenha())
            );
        } catch (BadCredentialsException e) {
            loginAttemptService.registrarFalha(request.getUsername(), ip);
            return ResponseEntity.status(401).body("Username ou senha inválidos.");
        }

        loginAttemptService.registrarSucesso(request.getUsername(), ip);
        String token = jwtUtil.gerarToken(request.getUsername());
        String refreshToken = refreshTokenService.criarRefreshToken(request.getUsername());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, criarCookieRefresh(refreshToken).toString())
                .body(new AuthResponse(token, null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshTokenCookie,
                                     @RequestBody(required = false) RefreshTokenRequest request) {
        String refreshToken = resolverRefreshToken(refreshTokenCookie, request == null ? null : request.getRefreshToken());
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(401).body("Refresh token ausente.");
        }

        try {
            RefreshTokenService.RefreshResult result = refreshTokenService.rotacionar(refreshToken);
            String novoAccessToken = jwtUtil.gerarToken(result.username());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, criarCookieRefresh(result.refreshToken()).toString())
                    .body(new AuthResponse(novoAccessToken, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.SET_COOKIE, limparCookieRefresh().toString())
                    .body("Refresh token inválido.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshTokenCookie,
                                    @RequestBody(required = false) LogoutRequest request) {
        String refreshToken = resolverRefreshToken(refreshTokenCookie, request == null ? null : request.getRefreshToken());
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revogar(refreshToken);
        }

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, limparCookieRefresh().toString())
                .build();
    }

    private String resolverRefreshToken(String cookieToken, String bodyToken) {
        if (cookieToken != null && !cookieToken.isBlank()) {
            return cookieToken;
        }
        return bodyToken;
    }

    private ResponseCookie criarCookieRefresh(String refreshToken) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(refreshCookieSecure)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ofMillis(refreshExpirationMs))
                .build();
    }

    private ResponseCookie limparCookieRefresh() {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(refreshCookieSecure)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ZERO)
                .build();
    }
}
