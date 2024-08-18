package org.asankasi.springbootwebsocket.controller;

import lombok.RequiredArgsConstructor;
import org.asankasi.springbootwebsocket.model.Action;
import org.asankasi.springbootwebsocket.model.ChatMessage;
import org.asankasi.springbootwebsocket.model.User;
import org.asankasi.springbootwebsocket.service.MemberStore;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatController {

	private final MemberStore memberStore;
	private final SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/user")
	public void getUsers(User user, SimpMessageHeaderAccessor headerAccessor) throws Exception {
		headerAccessor.getSessionAttributes().put("user", user);
		memberStore.addMember(user);
		sendMembersList();
		ChatMessage newChatMessage = new ChatMessage(user, null, "", Action.JOINED, Instant.now());
		simpMessagingTemplate.convertAndSend("/topic/messages", newChatMessage);
	}

	@EventListener
	public void handleSessionConnectEvent(SessionConnectEvent event) {
		System.out.println("Session Connect Event");
	}

	@EventListener
	public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
		System.out.println("Session Disconnect Event");
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
		if (sessionAttributes == null) {
			return;
		}
		User user = (User) sessionAttributes.get("user");
		if (user == null) {
			return;
		}
		memberStore.removeMember(user);
		sendMembersList();

		ChatMessage chatMessage = new ChatMessage(user, null, "", Action.LEFT, Instant.now());
		simpMessagingTemplate.convertAndSend("/topic/messages", chatMessage);

	}

	@MessageMapping("/message")
	public void getChatMessage(ChatMessage chatMessage) throws Exception {
		ChatMessage newChatMessage = new ChatMessage(chatMessage.user(), chatMessage.receiverId(), chatMessage.comment(), chatMessage.action(), Instant.now());
		simpMessagingTemplate.convertAndSend("/topic/messages", newChatMessage);
	}

	@MessageMapping("/privatemessage")
	public void getPrivateChatMessage(ChatMessage chatMessage) throws Exception {
		ChatMessage newChatMessage = new ChatMessage(chatMessage.user(), chatMessage.receiverId(), chatMessage.comment(), chatMessage.action(), Instant.now());
		simpMessagingTemplate.convertAndSendToUser(memberStore.getMember(chatMessage.receiverId()).id(), "/topic/privatemessages", newChatMessage);

	}

	private void sendMembersList() {
		List<User> memberList = memberStore.getMembersList();
		memberList.forEach(
				sendUser -> simpMessagingTemplate.convertAndSendToUser(sendUser.id(), "/webchatUsers", memberStore.filterMemberListByUser(sendUser)));
	}

}