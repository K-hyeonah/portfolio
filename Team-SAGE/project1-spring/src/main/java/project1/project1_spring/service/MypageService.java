package project1.project1_spring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project1.project1_spring.dto.ProfileResponse;
import project1.project1_spring.dto.UpdateProfileRequest;
import project1.project1_spring.entity.UserEntity;
import project1.project1_spring.repository.UserRepository;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class MypageService {

    private final UserRepository userRepository;

    /** 마이페이지 - 사용자 프로필 조회 */
    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String userId) {
        UserEntity u = userRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자 정보가 없습니다."));
        return new ProfileResponse(u);
    }

    @Transactional
    public UpdateProfileRequest setInfo(String userId, ProfileResponse user) {
        UpdateProfileRequest updaterequest = new UpdateProfileRequest();
        updaterequest.setName(user.getName());
        updaterequest.setBirthDay(user.getBirthDay());
        updaterequest.setBirthMonth(user.getBirthMonth());
        updaterequest.setBirthYear(user.getBirthYear());
        updaterequest.setProvince(user.getProvince());
        updaterequest.setCity(user.getCity());
        updaterequest.setDetailAddress(user.getDetailAddress());
        updaterequest.setYyGrade(user.getYyGrade());

        return  updaterequest;
    }

    /** 마이페이지 - 프로필 정보 수정 */
    @Transactional
    public void updateProfile(String userId, UpdateProfileRequest upReq) {
        UserEntity u = userRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다."));

        u.setName(upReq.getName());
        u.setBirthYear(upReq.getBirthYear());
        u.setBirthMonth(upReq.getBirthMonth());
        u.setBirthDay(upReq.getBirthDay());
        u.setProvince(upReq.getProvince());
        u.setCity(upReq.getCity());
        u.setDetailAddress(upReq.getDetailAddress());
        u.setYyGrade(upReq.getYyGrade());
    }
}
