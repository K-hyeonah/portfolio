package com.example.ApiRound.crm.hyeonah.Repository;


import com.example.ApiRound.crm.hyeonah.entity.ManagerUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerUserRepository extends JpaRepository<ManagerUser, Long> {
    ManagerUser findByEmail(String email);

    boolean existsByEmail(String email);
}