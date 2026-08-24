package smartbus_backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path frontendRoot = Paths.get(System.getProperty("user.dir"), "..", "frontend").toAbsolutePath().normalize();

        registry.addResourceHandler("/login.html")
                .addResourceLocations("file:" + frontendRoot.resolve("pages").toString() + "/");

        registry.addResourceHandler("/css/**")
                .addResourceLocations("file:" + frontendRoot.resolve("css").toString() + "/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("file:" + frontendRoot.resolve("js").toString() + "/");

        registry.addResourceHandler("/pages/**")
                .addResourceLocations("file:" + frontendRoot.resolve("pages").toString() + "/");
    }
}
