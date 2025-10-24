package com.example.ApiRound.crm.hyeonah.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationServiceImpl implements EmailVerificationService {
    
    private final JavaMailSender mailSender;
    
    // 인증 코드 저장 (실제 운영에서는 Redis 사용 권장)
    private final Map<String, VerificationData> verificationStore = new ConcurrentHashMap<>();
    
    private static final String CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 6;
    private static final long EXPIRATION_TIME = TimeUnit.MINUTES.toMillis(5); // 5분
    
    @Autowired
    public EmailVerificationServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    @Override
    public void sendVerificationCode(String email, String userType) {
        // 인증 코드 생성
        String code = generateCode();
        
        // 저장
        verificationStore.put(email, new VerificationData(code, System.currentTimeMillis()));
        
        // 이메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[HealnGo] 이메일 인증 코드");
        message.setText(
            "안녕하세요, HealnGo입니다.\n\n" +
            "이메일 인증 코드: " + code + "\n\n" +
            "이 코드는 5분간 유효합니다.\n" +
            "본인이 요청하지 않았다면 이 메일을 무시하세요."
        );
        
        mailSender.send(message);
    }
    
    @Override
    public boolean verifyCode(String email, String code) {
        VerificationData data = verificationStore.get(email);
        
        if (data == null) {
            return false;
        }
        
        // 만료 확인
        if (System.currentTimeMillis() - data.timestamp > EXPIRATION_TIME) {
            verificationStore.remove(email);
            return false;
        }
        
        // 코드 검증
        return data.code.equals(code);
    }
    
    @Override
    public void clearCode(String email) {
        verificationStore.remove(email);
    }
    
    private String generateCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        
        return code.toString();
    }
    
    // 내부 클래스
    private static class VerificationData {
        String code;
        long timestamp;
        
        VerificationData(String code, long timestamp) {
            this.code = code;
            this.timestamp = timestamp;
        }
    }
}

