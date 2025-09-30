package project1.project1_spring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import project1.project1_spring.entity.UserEntity;
import project1.project1_spring.repository.UserRepository;

import java.util.Collections;

//Spring Security 인증을 처리하는 핵심 서비스
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        return new org.springframework.security.core.userdetails.User(
                userEntity.getUserId(), //사용자ID
                userEntity.getPassword(), //암호화된 비밀번호
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")) //사용자 권한, 추가가능
        );
    }
}