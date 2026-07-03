package com.farmacia.service;

import com.farmacia.model.Usuario;
import com.farmacia.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = new Usuario("admin", passwordEncoder.encode("admin123"), Usuario.Role.ADMIN);
            usuarioRepository.save(admin);
            System.out.println("Usuário 'admin' com senha 'admin123' (Role ADMIN) inicializado com sucesso.");
        }
        if (!usuarioRepository.existsByUsername("cliente")) {
            Usuario cliente = new Usuario("cliente", passwordEncoder.encode("cliente123"), Usuario.Role.USER);
            usuarioRepository.save(cliente);
            System.out.println("Usuário 'cliente' com senha 'cliente123' (Role USER) inicializado com sucesso.");
        }
    }
}
