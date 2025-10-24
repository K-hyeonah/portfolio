package com.example.ApiRound.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /crm/** 경로를 /static/crm/**로 매핑
        registry.addResourceHandler("/crm/**")
                .addResourceLocations("classpath:/static/crm/");
        
        // 기존 /resources/** 경로 유지
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("classpath:/static/resources/");
    }
}
