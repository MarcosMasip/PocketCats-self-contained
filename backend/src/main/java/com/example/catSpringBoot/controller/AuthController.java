package com.example.catSpringBoot.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.catSpringBoot.model.User;
import com.example.catSpringBoot.repository.UserRepository;
import com.example.catSpringBoot.security.TokenProvider;
import com.example.catSpringBoot.security.UserPrincipal;

import java.util.Map;

/**
 * Authentication helper controller for local demo login.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    /**
     * Issue a JWT for a local demo user (no external OAuth required).
     */
    @PostMapping("/demo")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Map<String, String>> demoLogin() {
        String username = "demo_user";
        User user = userRepository.findByUsername(username).orElseGet(() -> {
            User u = new User();
            u.setName(username);
            u.setEmail("demo_user@example.com");
            u.setProviderId("demo");
            return userRepository.save(u);
        });

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(
            principal,
            null,
            principal.getAuthorities()
        );
        String token = tokenProvider.createToken(auth);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}
