package smartbus_backend.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String frontendRoot = Paths.get(
                System.getProperty("user.dir"),
                "frontend"
        ).toAbsolutePath().normalize().toString();

        registry.addResourceHandler("/login.html")
                .addResourceLocations("file:" + frontendRoot + "/pages/");

        registry.addResourceHandler("/css/**")
                .addResourceLocations("file:" + frontendRoot + "/css/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("file:" + frontendRoot + "/js/");

        registry.addResourceHandler("/pages/**")
                .addResourceLocations("file:" + frontendRoot + "/pages/");
    }
}