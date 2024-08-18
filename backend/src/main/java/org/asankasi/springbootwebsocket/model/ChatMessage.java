package org.asankasi.springbootwebsocket.model;

import java.time.Instant;

public record ChatMessage(User user, String receiverId, String comment, Action action, Instant timestamp){
}
