package com.farmacia.service;

import com.farmacia.model.Usuario;
import com.farmacia.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario cadastrar(String username, String senhaTextoPuro) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username nao pode ser nulo ou vazio.");
        }
        String usernameNormalizado = username.trim();

        if (usuarioRepository.existsByUsername(usernameNormalizado)) {
            throw new IllegalArgumentException("Já existe um usuário com esse username.");
        }
        if (senhaTextoPuro == null || senhaTextoPuro.length() < 8) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 8 caracteres.");
        }

        // A senha nunca é salva em texto puro: aplicamos o hash BCrypt antes de persistir.
        String senhaCriptografada = passwordEncoder.encode(senhaTextoPuro);
        Usuario usuario = new Usuario(usernameNormalizado, senhaCriptografada, Usuario.Role.USER);
        return usuarioRepository.save(usuario);
    }
}
