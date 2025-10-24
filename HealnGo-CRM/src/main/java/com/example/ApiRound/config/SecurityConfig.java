package com.example.ApiRound.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    /**
     * 비밀번호 암호화
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * 1) 업체용 체인: /crm/**, /company/**, /admin/**, /api/crm/** 전용
     */
    @Bean
    @Order(1)
    public SecurityFilterChain companyChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/crm/**", "/company/**", "/admin/**", "/api/crm/**", "/ws/**")
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    // 공개 페이지(업체)
                    "/crm/crm_login",
                    "/crm/company_signup",
                    "/crm/forgot-password",
                    "/crm/forgot-crm-password",
                    "/crm/forgot-crm-email",
                    // WebSocket
                    "/ws/**",
                    // API (공개)
                    "/crm/check-email",
                    "/crm/send-code",
                    "/crm/verify-code",
                    "/crm/register",
                    "/crm/register-manager",
                    "/crm/login",
                    "/crm/reset-password",
                    "/crm/api/current-company",  // 현재 업체 ID 조회 API
                    "/api/crm/**",
                    // 정적 리소스(업체)
                    "/crm/css/**", 
                    "/crm/js/**", 
                    "/crm/images/**"
                ).permitAll()
                // 세션 기반 인증 페이지 (컨트롤러에서 체크)
                .requestMatchers("/admin/**").authenticated()
                // /company/** 경로는 인증 필요
                .requestMatchers("/company/**").authenticated()
                // 나머지 CRM 경로는 인증 필요
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/crm/crm_login")  // 인증 필요시 이 페이지로 리다이렉트
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/crm/logout")
                .logoutSuccessUrl("/crm/crm_login")
                .permitAll()
            );
        
        return http.build();
    }
    
    /**
     * 2) 고객용 체인: 나머지 전체
     */
    @Bean
    @Order(2)
    public SecurityFilterChain customerChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    // 공개 페이지(고객)
                    "/", "/index", "/main",
                    "/login", "/signup", "/user-signup",
                    "/location", "/notice", "/list",
                    "/detail/**",
                    "/category/**",
                    "/search", "/lang",
                    "/tourism/**",
                    "/logout",
                    "/forget-password", "/forgot-password",
                    // OAuth
                    "/oauth/**",
                    // WebSocket
                    "/ws/**",
                    // API (공개)
                    "/api/user/**",
                    "/api/**",
                    // 정적 리소스(공통)
                    "/css/**", "/js/**", "/images/**",
                    "/resources/**", "/static/**",
                    // 세션 기반 인증 페이지 (컨트롤러에서 체크)
                    "/mypage/**", "/favorite/**", "/reservation/**", "/review/**", "/chat/**", "/inquiry/**"
                ).permitAll()
                .anyRequest().permitAll()  // 나머지는 공개
            )
            .formLogin(form -> form
                .loginPage("/login")  // 인증 필요시 이 페이지로 리다이렉트
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/main")
                .permitAll()
            );
        
        return http.build();
    }
}
