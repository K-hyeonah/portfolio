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
@Table(name = "faq_table")
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "faq_board_seq")
    @SequenceGenerator(name = "faq_board_seq", sequenceName = "faq_board_seq", allocationSize = 1)
    private Long id;

    private String title;

    private String question;

    private String writer;

    @Column(name = "view_count")
    private int viewCount;

    @Column(name = "post_type")
    private String postType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String answer;

}