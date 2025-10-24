package com.example.ApiRound.crm.hyeonah.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "manager_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manager_id")         // DB: INT AI PK
    private Integer managerId;           // ✅ Long → Integer 로 변경

    @Column(name = "email", unique = true, nullable = false, length = 190)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "is_active")
    private Integer isActive; // 1 활성, 0 비활성

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = 1;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
