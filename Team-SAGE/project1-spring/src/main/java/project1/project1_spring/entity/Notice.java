package project1.project1_spring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "notice_board")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notice_board_seq")
    @SequenceGenerator(name = "notice_board_seq", sequenceName = "notice_board_seq", allocationSize = 1)
    private Long id;

    private String title;

    @Column(columnDefinition = "CLOB")
    private String content;

    private String writer;

    @Column(name = "view_count")
    private int viewCount;

    @Column(name = "post_type")
    private String postType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}