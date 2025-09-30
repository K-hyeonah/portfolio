package com.example.ApiRound.mapper;

import com.example.ApiRound.dto.SocialUserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
/*
* Mapper는 단순 DB접근
* */
@Mapper
public interface SocialUserMapper {
    // 사용자 저장
    void insertUser(SocialUserDTO user);

    void updateUser(SocialUserDTO user);
    // 소셜 ID + PROVIDER로 사용자 조회
    SocialUserDTO findBySocialIdAndProvider(
            @Param("socialId") String socialId,
            @Param("provider") String provider
    );
}
