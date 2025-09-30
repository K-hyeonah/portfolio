package com.example.ApiRound.mapper;

import com.example.ApiRound.dto.FavoriteItemDto;
import com.example.ApiRound.dto.ListDto;

import java.util.List;

public interface FavoriteItemMapper {
    int insertFavorite(FavoriteItemDto favorite);

    void deleteFavorite(Long userId, Long itemId);

    boolean isFavorite(Long userId, Long itemId);

    List<ListDto> getFavoritesByUserId(Long userId);
}
