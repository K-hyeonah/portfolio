package com.apiround.greenhub.repository;

import com.apiround.greenhub.entity.RecipeXProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeXProductRepository extends JpaRepository<RecipeXProduct, Integer> {
    List<RecipeXProduct> findByRecipeRecipeId(Integer recipeId);
}
