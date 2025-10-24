package com.example.ApiRound.crm.minggzz;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ApiRound.Service.ItemListService;
import com.example.ApiRound.crm.yoyo.medi.MediServiceEntity;
import com.example.ApiRound.crm.yoyo.medi.MediServiceRepository;
import com.example.ApiRound.entity.ItemList;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/items")
public class PublicMediServiceController {

    private final MediServiceRepository mediServiceRepository;
    private final ItemListService itemListService;

    /** 선택한 itemId의 서비스 목록 조회 (공개, 세션 불필요) */
    @GetMapping("/{itemId}/services")
    public ResponseEntity<List<MediServiceDto>> getServicesByItem(@PathVariable Long itemId) {
        List<MediServiceDto> list = mediServiceRepository
                .findAllByItem_IdOrderByServiceIdDesc(itemId)
                .stream()
                .map(MediServiceDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    /** 단일 서비스 조회 (공개, 세션 불필요) */
    @GetMapping("/services/{serviceId}")
    public ResponseEntity<MediServiceDetailDto> getServiceById(@PathVariable Long serviceId) {
        return mediServiceRepository.findById(serviceId)
                .map(MediServiceDetailDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** 단일 아이템(병원) 조회 (공개, 세션 불필요) */
    @GetMapping("/{itemId}")
    public ResponseEntity<ItemDto> getItemById(@PathVariable Long itemId) {
        return itemListService.findById(itemId)
                .map(ItemDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** 공개 응답용 DTO (엔티티의 지연 로딩 객체를 배제) */
    public static class MediServiceDto {
        public Long serviceId;
        public String name;
        public String description;
        public String serviceCategory;
        public BigDecimal price;
        public String currency;
        public String tags;
        public String genderTarget;   // enum -> 문자열
        public String targetCountry;  // enum -> 문자열
        public LocalDate startDate;
        public LocalDate endDate;

        public static MediServiceDto from(MediServiceEntity e) {
            MediServiceDto d = new MediServiceDto();
            d.serviceId = e.getServiceId();
            d.name = e.getName();
            d.description = e.getDescription();
            d.serviceCategory = e.getServiceCategory();
            d.price = e.getPrice();
            d.currency = e.getCurrency();
            d.tags = e.getTags();
            d.genderTarget = (e.getGenderTarget() != null ? e.getGenderTarget().name() : null);
            d.targetCountry = (e.getTargetCountry() != null ? e.getTargetCountry().name() : null);
            d.startDate = e.getStartDate();
            d.endDate = e.getEndDate();
            return d;
        }
    }

    /** 서비스 상세 조회용 DTO (itemId 포함) */
    public static class MediServiceDetailDto {
        public Long serviceId;
        public Long itemId;
        public String name;
        public String description;
        public String serviceCategory;
        public BigDecimal price;
        public String currency;
        public String tags;
        public String genderTarget;
        public String targetCountry;
        public LocalDate startDate;
        public LocalDate endDate;
        public Boolean vatIncluded;
        public Boolean isRefundable;

        public static MediServiceDetailDto from(MediServiceEntity e) {
            MediServiceDetailDto d = new MediServiceDetailDto();
            d.serviceId = e.getServiceId();
            d.itemId = (e.getItem() != null ? e.getItem().getId() : null);
            d.name = e.getName();
            d.description = e.getDescription();
            d.serviceCategory = e.getServiceCategory();
            d.price = e.getPrice();
            d.currency = e.getCurrency();
            d.tags = e.getTags();
            d.genderTarget = (e.getGenderTarget() != null ? e.getGenderTarget().name() : null);
            d.targetCountry = (e.getTargetCountry() != null ? e.getTargetCountry().name() : null);
            d.startDate = e.getStartDate();
            d.endDate = e.getEndDate();
            d.vatIncluded = e.getVatIncluded();
            d.isRefundable = e.getIsRefundable();
            return d;
        }
    }

    /** 아이템(병원) 조회용 DTO */
    public static class ItemDto {
        public Long id;
        public String name;
        public String address;
        public String phone;
        public String homepage;
        public String region;
        public String subregion;
        public String category;

        public static ItemDto from(ItemList item) {
            ItemDto dto = new ItemDto();
            dto.id = item.getId();
            dto.name = item.getName();
            dto.address = item.getAddress();
            dto.phone = item.getPhone();
            dto.homepage = item.getHomepage();
            dto.region = item.getRegion();
            dto.subregion = item.getSubregion();
            dto.category = item.getCategory();
            return dto;
        }
    }
}
