package project1.project1_spring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project1.project1_spring.dto.FindIdRequest;
import project1.project1_spring.entity.UserEntity;
import project1.project1_spring.repository.UserRepository;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class IdService {
    private final UserRepository userRepository;

    /** 아이디 찾기 */
    public String findUserId(FindIdRequest idReq) {
        UserEntity user = userRepository.findByNameAndBirthYearAndBirthMonthAndBirthDay(
                idReq.getName()
                , idReq.getBirthYear()
                , idReq.getBirthMonth()
                , idReq.getBirthDay()
        ).orElseThrow(() ->
                new NoSuchElementException("일치하는 회원 정보가 없습니다.")
        );
        return user.getUserId();
    }
}
