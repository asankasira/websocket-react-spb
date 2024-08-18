export class ChatMessage {
    user;
    receiverId;
    comment;
    action;
    timestamp;

    constructor(user, receiverId, comment, action, timestamp) {
        this.user = user;
        this.receiverId = receiverId
        this.comment = comment;
        this.action = action;
        this.timestamp = timestamp;
    }
}