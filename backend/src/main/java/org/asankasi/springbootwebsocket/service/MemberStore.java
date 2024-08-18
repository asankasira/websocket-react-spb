package org.asankasi.springbootwebsocket.service;

import org.asankasi.springbootwebsocket.model.User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

@Service
public class MemberStore {

	private final static List<User> store = new LinkedList<>();


	public List<User> getMembersList() {
		return Collections.unmodifiableList(store);
	}

	public List<User> filterMemberListByUser(User user) {
		return store.stream()
				.filter(filterUser -> !Objects.equals(filterUser.id(), user.id()))
				.toList();
	}

	public User getMember(String id) {
		return store.stream().filter(usr -> Objects.equals(usr.id(), id)).findFirst().orElse(null);
	}

	public void addMember(User member) {
		store.add(member);
	}

	public void removeMember(User member) {
		store.remove(member);
	}
}