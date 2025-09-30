package com.example.ApiRound;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.ApiRound.mapper")
public class ApiRoundApplication {

	public static void main(String[] args) {

		SpringApplication.run(ApiRoundApplication.class, args);
	}

}
