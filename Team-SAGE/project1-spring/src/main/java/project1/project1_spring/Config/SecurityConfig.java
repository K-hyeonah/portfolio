package project1.project1_spring.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.SecurityFilterChain;
import project1.project1_spring.service.CustomUserDetailsService;

import javax.swing.*;

//Spring Security 설정
@Configuration
@EnableWebSecurity // 활성화
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 접근 권한 설정
        http.authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/", "/login", "/signup", "/css/**", "/js/**"
                                ,"/img/**","/svg/**","/data/**","/findid","/find-pw","/facility-detail"
                                ,"/chat","/faq","/notice","/compare","/facilities","/api/facilities/search"
                                ,"/facilities/*","/facility-detail/*","/inquiry","/hireinfo","/grade"
                                ,"/notice/*","/faq/*","/youtube","/api/region/*","/payinfo","/policy"
                                ,"/api/facilities","/find-id-res","/find-pw/reset").permitAll()
                        .requestMatchers("/mypage","/verify","/editinfo").authenticated()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/", true)
                        .failureUrl("/login")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                )
                //로그인 시 Spring Security가 사용자 정보를 불러올 때 사용하는 서비스
                .userDetailsService(customUserDetailsService);

        return http.build();
    }

    // 사용자 비밀번호를 암호화하기 위한 BCrypt 인코더
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
            throws Exception {
        return configuration.getAuthenticationManager();
    }
}
