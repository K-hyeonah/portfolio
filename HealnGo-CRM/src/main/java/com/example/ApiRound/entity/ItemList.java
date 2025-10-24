package com.example.ApiRound.entity;

import java.time.LocalDateTime;

import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "item_list")
@Data
public class ItemList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 병원/업체 표시명 */
    @Column(name = "name", nullable = false)
    private String name;

    /** 광역(시/도) */
    @Column(name = "region")
    private String region;

    /** 기초(시/군/구) */
    @Column(name = "subregion")
    private String subregion;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "homepage")
    private String homepage;

    @Column(name = "coord_x")
    private Double coordX;

    @Column(name = "coord_y")
    private Double coordY;

    /** 카테고리(성형외과/피부과/약국/… 또는 tourism/package 등) */
    @Column(name = "category")
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_company_id", referencedColumnName = "company_id")
    private CompanyUser ownerCompany;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ItemList() {}

    public ItemList(String name, String region, String subregion, String address,
                    String phone, String homepage, Double coordX, Double coordY,
                    String category, CompanyUser ownerCompany) {
        this.name = name;
        this.region = region;
        this.subregion = subregion;
        this.address = address;
        this.phone = phone;
        this.homepage = homepage;
        this.coordX = coordX;
        this.coordY = coordY;
        this.category = category;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.ownerCompany = ownerCompany;
    }
}
