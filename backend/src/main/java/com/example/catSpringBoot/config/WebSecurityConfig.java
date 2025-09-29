package com.example.catSpringBoot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.catSpringBoot.security.TokenAuthenticationFilter;
import com.example.catSpringBoot.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.example.catSpringBoot.service.CustomOAuth2UserService;

/**
 * Configure Spring Security
 */
@EnableWebSecurity
public class WebSecurityConfig {
    /**
     * The OAuth2 authentication success handler
     */
    @Autowired
    OAuth2AuthenticationSuccessHandler successHandler;
    /**
     * The custom OAuth2 user service
     */
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    /**
     * Create a bean for the token authentication filter
     * 
     * @return TokenAuthenticationFilter
     */
    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter();
    }

    /**
     * Configure the security filter chain
     * 
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception the exception
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // ...
        http.cors().and()// Enable CORS support
                .csrf().disable() // Disable CSRF protection for simplicity (enable if needed)
                .authorizeRequests()
                .antMatchers("/", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/auth/demo").permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .and()
                .oauth2Login()
                .userInfoEndpoint()
                .userService(customOAuth2UserService)
                .and()
                .successHandler(successHandler);
        http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}