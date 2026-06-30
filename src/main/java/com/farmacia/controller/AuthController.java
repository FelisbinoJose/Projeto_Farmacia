package com.farmacia.controller;

import com.farmacia.dto.AuthResponse;
import com.farmacia.dto.LoginRequest;
import com.farmacia.dto.RegistroRequest;
import com.farmacia.model.Usuario;
import com.farmacia.security.JwtUtil;
import com.farmacia.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequest request) {
        try {
            Usuario usuario = usuarioService.cadastrar(request.getUsername(), request.getSenha());
            return ResponseEntity.ok().body("Usuário '" + usuario.getUsername() + "' cadastrado com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getSenha())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Username ou senha inválidos.");
        }

        String token = jwtUtil.gerarToken(request.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
