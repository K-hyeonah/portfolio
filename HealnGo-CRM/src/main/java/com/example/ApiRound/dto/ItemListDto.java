package com.example.ApiRound.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ItemListDto {
    private Long id;
    private String name;
    private String region;
    private String subregion;
    private String address;
    private String phone;
    private String homepage;
    private Double coordX;
    private Double coordY;
    private String category;
    private Integer ownerCompanyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static ItemListDto from(com.example.ApiRound.entity.ItemList item) {
        ItemListDto dto = new ItemListDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setRegion(item.getRegion());
        dto.setSubregion(item.getSubregion());
        dto.setAddress(item.getAddress());
        dto.setPhone(item.getPhone());
        dto.setHomepage(item.getHomepage());
        dto.setCoordX(item.getCoordX());
        dto.setCoordY(item.getCoordY());
        dto.setCategory(item.getCategory());
        dto.setOwnerCompanyId(item.getOwnerCompany() != null ? item.getOwnerCompany().getCompanyId() : null);
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
