package smartbus_backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import smartbus_backend.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    // ==============================
    // PASSWORD ENCODER
    // ==============================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ==============================
    // AUTHENTICATION PROVIDER
    // ==============================
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // ==============================
    // AUTHENTICATION MANAGER
    // ==============================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }

    // ==============================
    // CORS CONFIGURATION
    // ==============================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:8000",
                "http://127.0.0.1:8000",
                 "https://a-jeyabharathi.github.io"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH"
        ));

        configuration.setAllowedHeaders(List.of(
                "Content-Type",
                "Authorization",
                "Accept"
        ));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // ==============================
    // SECURITY FILTER CHAIN
    // ==============================
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // ------------------------------
            // CORS
            // ------------------------------
            .cors(cors ->
                    cors.configurationSource(corsConfigurationSource())
            )

            // ------------------------------
            // CSRF
            // ------------------------------
            .csrf(csrf -> csrf
                    .ignoringRequestMatchers(
                            "/api/auth/login",
                            "/api/auth/register",
                            "/api/auth/logout"
                    )
            )

            // ------------------------------
            // AUTHORIZATION
            // ------------------------------
            .authorizeHttpRequests(auth -> auth

                    // Allow OPTIONS requests
                    .requestMatchers(
                            HttpMethod.OPTIONS,
                            "/**"
                    ).permitAll()

                    // Public bus location API
                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/buses/*/location"
                    ).permitAll()

                    // Public pages and authentication APIs
                    .requestMatchers(
                            "/",
                            "/index.html",
                            "/error",
                            "/favicon.ico",

                            "/login.html",
                            "/pages/login.html",

                            "/css/**",
                            "/js/**",

                            "/api/auth/login",
                            "/api/auth/register",
                            "/api/auth/logout"
                    ).permitAll()

                    // Protected pages
                    .requestMatchers(
                            "/pages/dashboard.html",
                            "/pages/buses.html",
                            "/pages/routes.html",
                            "/pages/predictions.html"
                    ).authenticated()

                    // Current logged-in user
                    .requestMatchers(
                            "/api/auth/me"
                    ).authenticated()

                    // Everything else requires authentication
                    .anyRequest().authenticated()
            )

            // ------------------------------
            // SESSION MANAGEMENT
            // ------------------------------
            .sessionManagement(session ->
                    session.sessionFixation().migrateSession()
            )

            // ------------------------------
            // LOGOUT
            // ------------------------------
            .logout(logout -> logout

                    .logoutUrl("/api/auth/logout")

                    .logoutSuccessUrl(
                            "/login.html?logout=true"
                    )

                    .invalidateHttpSession(true)

                    .deleteCookies("JSESSIONID")

                    .permitAll()
            );

        // ------------------------------
        // AUTHENTICATION PROVIDER
        // ------------------------------
        http.authenticationProvider(
                authenticationProvider()
        );

        return http.build();
    }
}