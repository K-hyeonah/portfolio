package com.example.ApiRound.Service;

import com.example.ApiRound.dto.FavoriteItemDto;
import com.example.ApiRound.dto.ListDto;
import com.example.ApiRound.mapper.FavoriteItemMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Transactional
@Service
public class FavoriteItemServiceImpl implements FavoriteItemService {

    private final FavoriteItemMapper favoriteItemMapper;

    public FavoriteItemServiceImpl(FavoriteItemMapper favoriteItemMapper) {
        this.favoriteItemMapper = favoriteItemMapper;
    }

    @Override
    public void addFavorite(Long userId, Long itemId) {
        if (!favoriteItemMapper.isFavorite(userId, itemId)) {
            FavoriteItemDto dto = new FavoriteItemDto();
            dto.setUserId(userId);
            dto.setItemId(itemId);
            int res = favoriteItemMapper.insertFavorite(dto);
            System.out.println("insertFavorite 결과: " + res);
        }else {
            System.out.println("이미 즐겨찾기 있음");
        }
    }

    @Override
    public void removeFavorite(Long userId, Long itemId) {
        favoriteItemMapper.deleteFavorite(userId, itemId);
    }

    @Override
    public boolean isFavorite(Long userId, Long itemId) {
        return favoriteItemMapper.isFavorite(userId, itemId);
    }

    @Override
    public List<ListDto> getFavoriteItems(Long userId) {
        return favoriteItemMapper.getFavoritesByUserId(userId);
    }

    @Override
    public List<ListDto> getFavoritesByUserId(Long userId) {
        List<ListDto> favorites = favoriteItemMapper.getFavoritesByUserId(userId);
        
        // 구글맵 API에서 사진 URL 가져오기
        for (ListDto favorite : favorites) {
            if (favorite.getCoordX() != null && favorite.getCoordY() != null) {
                String imageUrl = getGoogleMapsImageUrl(favorite.getCoordX(), favorite.getCoordY(), favorite.getName());
                favorite.setImageUrl(imageUrl);
            }
        }
        
        return favorites;
    }
    
    private String getGoogleMapsImageUrl(Double lat, Double lng, String name) {
        try {
            // 구글맵 Static Maps API를 사용하여 사진 URL 생성
            String googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // 실제 API 키로 교체 필요
            String imageUrl = String.format(
                "https://maps.googleapis.com/maps/api/staticmap?center=%f,%f&zoom=15&size=400x300&maptype=roadmap&markers=color:red|%f,%f&key=%s",
                lat, lng, lat, lng, googleMapsApiKey
            );
            return imageUrl;
        } catch (Exception e) {
            // 에러 발생 시 기본 이미지 반환
            return "/resources/images/detail/hospital.jpg";
        }
    }
}
