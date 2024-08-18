package org.asankasi.springbootwebsocket.config;

import org.asankasi.springbootwebsocket.handler.TutorialHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(tutorialSocketHandler(), "/tutorial").setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler tutorialSocketHandler() {
        return new TutorialHandler();
    }
}
