package com.example.CustomLecture.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "CustomLecture ",
                description = "CustomLecture "
        )
)
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {




        return new OpenAPI();

    }
}
