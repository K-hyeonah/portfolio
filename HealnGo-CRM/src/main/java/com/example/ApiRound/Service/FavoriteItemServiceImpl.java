package com.example.ApiRound.Service;

import com.example.ApiRound.entity.FavoriteItem;
import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.repository.FavoriteItemRepository;
import com.example.ApiRound.repository.ItemListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FavoriteItemServiceImpl implements FavoriteItemService {

    @Autowired
    private FavoriteItemRepository favoriteItemRepository;

    @Autowired
    private ItemListRepository itemListRepository;

    /** Long → Integer 변환(오버플로우 시 예외) */
    private Integer toIntExact(Long value) {
        if (value == null) return null;
        int intVal = value.intValue();
        if (intVal != value.longValue()) {
            throw new IllegalArgumentException("userId가 INT 범위를 초과합니다: " + value);
        }
        return intVal;
    }

    @Override
    public void addFavorite(Long userId, Long itemId) {
        FavoriteItem favoriteItem = new FavoriteItem();
        favoriteItem.setUserId(toIntExact(userId)); // Integer로 변환
        favoriteItem.setItemId(itemId);             // item_id는 BIGINT → Long
        favoriteItemRepository.save(favoriteItem);
    }

    @Override
    public void removeFavorite(Long userId, Long itemId) {
        favoriteItemRepository.deleteByUserIdAndItemId(toIntExact(userId), itemId);
    }

    @Override
    public boolean isFavorite(Long userId, Long itemId) {
        return favoriteItemRepository.existsByUserIdAndItemId(toIntExact(userId), itemId);
    }

    @Override
    public List<ItemList> getFavoriteItems(Long userId) {
        return favoriteItemRepository.findFavoriteItemsByUserId(toIntExact(userId));
    }

    @Override
    public List<ItemList> getFavoritesByUserId(Long userId) {
        return favoriteItemRepository.findFavoriteItemsByUserId(toIntExact(userId));
    }
}
