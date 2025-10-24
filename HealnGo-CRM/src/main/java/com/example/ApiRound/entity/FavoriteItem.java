package com.example.ApiRound.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "favorite_items")
@IdClass(FavoriteItem.FavoriteItemId.class)
@Data
@NoArgsConstructor
public class FavoriteItem {

    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;      // INT 매핑

    @Id
    @Column(name = "item_id", nullable = false)
    private Long itemId;         // BIGINT 매핑

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public FavoriteItem(Integer userId, Long itemId) {
        this.userId = userId;
        this.itemId = itemId;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    /** IdClass는 엔티티의 @Id 필드와 동일한 이름/타입이어야 함 */
    @Data
    @NoArgsConstructor
    public static class FavoriteItemId implements Serializable {
        private Integer userId;  // INT
        private Long itemId;     // BIGINT

        public FavoriteItemId(Integer userId, Long itemId) {
            this.userId = userId;
            this.itemId = itemId;
        }

        // 가끔 Lombok equals/hashCode가 문제 될 수 있어 수동 구현도 가능
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof FavoriteItemId that)) return false;
            return Objects.equals(userId, that.userId) &&
                    Objects.equals(itemId, that.itemId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, itemId);
        }
    }
}
