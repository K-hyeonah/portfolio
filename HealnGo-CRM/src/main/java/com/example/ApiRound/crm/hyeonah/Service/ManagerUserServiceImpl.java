package com.example.ApiRound.crm.hyeonah.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ApiRound.crm.hyeonah.Repository.ManagerUserRepository;
import com.example.ApiRound.crm.hyeonah.entity.ManagerUser;

@Service
public class ManagerUserServiceImpl implements ManagerUserService {
    
    @Autowired
    private ManagerUserRepository managerUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${admin.invite.code}")
    private String adminInviteCode;

    @Override
    public List<Map<String, Object>> getUserList(int pageNo, int amount, String search) {
        List<Map<String, Object>> users = new ArrayList<>();
        
        // 샘플 사용자 데이터 (실제로는 DB에서 조회) - 페이지네이션 테스트를 위해 14개 추가
        String[] usernames = {"둥그리둥둥", "힝구리퐁퐁", "thrujsjdf", "영화조아", "감튀엔케찹", "김민수", "이영희", "박철수", "정수진", "최동현",
                             "이서연", "박지훈", "최민지", "정현우"};
        String[] names = {"김은아", "성은지", "정승하", "고정민", "김정서", "김민수", "이영희", "박철수", "정수진", "최동현",
                         "이서연", "박지훈", "최민지", "정현우"};
        String[] emails = {"euneun@gmail.com", "sungsilver@naver.com", "hiJSH@gmail.com", "hihiko@naver.com", "sjdiahnw@gmail.com", 
                          "minsu@gmail.com", "younghee@naver.com", "chulsoo@gmail.com", "sujin@naver.com", "donghyun@gmail.com",
                          "seoyeon@naver.com", "jihoon@gmail.com", "minji@daum.net", "hyunwoo@naver.com"};
        
        // 검색 필터링
        List<Integer> filteredIndices = new ArrayList<>();
        for (int i = 0; i < usernames.length; i++) {
            if (search == null || search.trim().isEmpty() || 
                usernames[i].toLowerCase().contains(search.toLowerCase()) ||
                names[i].toLowerCase().contains(search.toLowerCase()) ||
                emails[i].toLowerCase().contains(search.toLowerCase())) {
                filteredIndices.add(i);
            }
        }
        
        // 페이지네이션 적용
        int startIndex = (pageNo - 1) * amount;
        int endIndex = Math.min(startIndex + amount, filteredIndices.size());
        
        for (int i = startIndex; i < endIndex; i++) {
            int index = filteredIndices.get(i);
            Map<String, Object> user = new HashMap<>();
            user.put("userId", String.format("%05d", 10014 - index));
            user.put("username", usernames[index] + " 님");
            user.put("name", names[index]);
            user.put("email", emails[index]);
            user.put("joinDate", "Sep 12, 2021");
            user.put("reportCount", 0); // 신고 횟수
            users.add(user);
        }
        
        return users;
    }

    @Override
    public int getTotalUserCount(String search) {
        // 샘플 데이터의 전체 사용자 수 (실제로는 DB에서 조회) - 페이지네이션 테스트를 위해 14개 추가
        String[] usernames = {"둥그리둥둥", "힝구리퐁퐁", "thrujsjdf", "영화조아", "감튀엔케찹", "김민수", "이영희", "박철수", "정수진", "최동현",
                             "이서연", "박지훈", "최민지", "정현우"};
        String[] names = {"김은아", "성은지", "정승하", "고정민", "김정서", "김민수", "이영희", "박철수", "정수진", "최동현",
                         "이서연", "박지훈", "최민지", "정현우"};
        String[] emails = {"euneun@gmail.com", "sungsilver@naver.com", "hiJSH@gmail.com", "hihiko@naver.com", "sjdiahnw@gmail.com", 
                          "minsu@gmail.com", "younghee@naver.com", "chulsoo@gmail.com", "sujin@naver.com", "donghyun@gmail.com",
                          "seoyeon@naver.com", "jihoon@gmail.com", "minji@daum.net", "hyunwoo@naver.com"};
        
        if (search == null || search.trim().isEmpty()) {
            return usernames.length;
        }
        
        int count = 0;
        for (int i = 0; i < usernames.length; i++) {
            if (usernames[i].toLowerCase().contains(search.toLowerCase()) ||
                names[i].toLowerCase().contains(search.toLowerCase()) ||
                emails[i].toLowerCase().contains(search.toLowerCase())) {
                count++;
            }
        }
        
        return count;
    }
    
    @Override
    public Optional<ManagerUser> login(String email, String password) {
        ManagerUser manager = managerUserRepository.findByEmail(email);
        
        if (manager != null && manager.getIsActive() == 1) {
            if (passwordEncoder.matches(password, manager.getPasswordHash())) {
                return Optional.of(manager);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public Optional<ManagerUser> findByEmail(String email) {
        ManagerUser manager = managerUserRepository.findByEmail(email);
        return Optional.ofNullable(manager);
    }
    
    @Override
    public ManagerUser register(String email, String password, String name, String phone, String inviteCode) {
        // 초대 코드 검증
        if (inviteCode == null || !inviteCode.equals(adminInviteCode)) {
            throw new IllegalArgumentException("유효하지 않은 초대 코드입니다.");
        }
        
        // 이메일 중복 확인
        if (managerUserRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        
        // 매니저 생성
        ManagerUser manager = ManagerUser.builder()
            .email(email)
            .passwordHash(passwordEncoder.encode(password))
            .name(name)
            .isActive(1)
            .build();
        
        return managerUserRepository.save(manager);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return managerUserRepository.existsByEmail(email);
    }
    
    @Override
    public void updatePassword(String email, String newPassword) {
        ManagerUser manager = managerUserRepository.findByEmail(email);
        
        if (manager == null) {
            throw new IllegalArgumentException("해당 이메일로 등록된 관리자를 찾을 수 없습니다.");
        }
        
        // 비밀번호 암호화 후 업데이트
        manager.setPasswordHash(passwordEncoder.encode(newPassword));
        managerUserRepository.save(manager);
    }
}
