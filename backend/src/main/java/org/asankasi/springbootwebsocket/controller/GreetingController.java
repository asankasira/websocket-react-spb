package org.asankasi.springbootwebsocket.controller;

import org.asankasi.springbootwebsocket.model.Greeting;
import org.asankasi.springbootwebsocket.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GreetingController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting performGreeting(Message message) {
        return new Greeting("Hello, " + message.name() + " !");
    }
}
