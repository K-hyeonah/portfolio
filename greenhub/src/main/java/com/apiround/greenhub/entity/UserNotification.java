package com.apiround.greenhub.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_notifications")
public class UserNotification {

    @Id
    @Column(name = "user_noti_id")
    private Integer id;
    @Column(name = "notification_id")
    private Integer notificationId;

    @Column(name = "user_id")
    private Integer userId;

    private Boolean isRead;

    @Enumerated(EnumType.STRING)
    private DeliveryMethod deliveredVia;

    private LocalDateTime readAt;
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public enum DeliveryMethod { EMAIL, MODAL, BOTH }
}
