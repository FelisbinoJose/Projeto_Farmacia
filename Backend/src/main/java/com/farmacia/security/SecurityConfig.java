package com.farmacia.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt: gera hash com salt embutido, é o padrão recomendado para senhas.
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setExposedHeaders(java.util.List.of("Authorization"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // API stateless com token, sem necessidade de CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos: login/refresh/registrar e os arquivos estáticos do front-end
                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/refresh", "/api/auth/registrar").permitAll()
                .requestMatchers("/", "/index.html", "/style.css", "/script.js", "/logo.png", "/static/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/logout").authenticated()
                // Cadastro público de cliente (self-registration)
                .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll()
                // Medicamentos: listagem e detalhes públicos. Alertas exigem autenticação.
                .requestMatchers(HttpMethod.GET, "/api/medicamentos/alertas").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/medicamentos/**").permitAll()
                // Outros endpoints REST exigem autenticação
                .requestMatchers(HttpMethod.GET, "/api/clientes/**", "/api/vendas/**", "/api/interacoes/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/vendas/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/clientes/**", "/api/medicamentos/**", "/api/interacoes/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/clientes/**", "/api/medicamentos/**", "/api/interacoes/**").hasRole("ADMIN")
                // Todo o resto da API exige token válido por padrão.
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
