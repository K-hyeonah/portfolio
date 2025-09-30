package project1.project1_spring.repository;

import project1.project1_spring.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUserId(String userId);

    Optional<UserEntity> findByName(String name);

    boolean existsByUserId(String userId);

    Optional<UserEntity> findByNameAndBirthYearAndBirthMonthAndBirthDay(String name, Integer birthYear, Integer birthMonth, Integer birthDay);

    Optional<UserEntity> findByUserIdAndNameAndBirthYearAndBirthMonthAndBirthDay(String userId, String name, Integer birthYear, Integer birthMonth, Integer birthDay);

    boolean existsByUserIdAndNameAndBirthYearAndBirthMonthAndBirthDay(String userId, String name, Integer birthYear, Integer birthMonth, Integer birthDay);
}