package com.example.ApiRound.Service;

import com.example.ApiRound.entity.ItemList;

import java.util.List;

public interface FavoriteItemService {

    void addFavorite(Long userId, Long itemId);

    void removeFavorite(Long userId, Long itemId);

    boolean isFavorite(Long userId, Long itemId);

    List<ItemList> getFavoriteItems(Long userId);

    List<ItemList> getFavoritesByUserId(Long userId);
}
