package com.example.ApiRound.Service;

import com.example.ApiRound.dto.ListDto;

import java.util.List;

public interface FavoriteItemService {

    void addFavorite(Long userId, Long itemId);
    void removeFavorite(Long userId, Long itemId);
    boolean isFavorite(Long userId, Long itemId);
    List<ListDto> getFavoriteItems(Long userId);
    List<ListDto> getFavoritesByUserId(Long userId);
}
