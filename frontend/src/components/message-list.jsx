import {useEffect, useState} from "react";
import '../chat.css'
import {useWebSocketService} from "../service/websocket-service";
import {PropTypes} from 'prop-types'

const privatePreUrl = "/user/";
const topicMsgUrl = "/topic/messages";
const privateTopicMsgUrl = "/topic/privatemessages";

export const MessageList = ({statusFlag, currentUser}) => {
    const [messages, setMessages] = useState([])
    const {subscribeToTopic} = useWebSocketService()

    useEffect(() => {
        const onMessageReceived = (payload) => {
            const message = JSON.parse(payload.body);
            setMessages((prevMessages) => [...prevMessages, message]);
        }

        if (statusFlag) {
            subscribeToTopic(topicMsgUrl, onMessageReceived)
            subscribeToTopic(privatePreUrl + currentUser.id + privateTopicMsgUrl, onMessageReceived)
        } else {
            setMessages([])
        }
    }, [statusFlag]);

    const renderMessages = (m, index) => {
        const d = new Date(m.timestamp)
        return (
            <tr key={index} className={m.receiverId && 'private'}>
                <td>{`${m.user.username} ${m.action} ${d.toLocaleString("nl-BE")} ${m.comment && ` - ${m.comment}`}`}</td>
            </tr>
        )
    }

    return (
        <div className="messages">
            <div id="conversation">
                <table>
                    <thead>
                    <tr>
                        <th>Messages:</th>
                    </tr>
                    </thead>
                    <tbody id="messagesList">
                    {messages.map((m, index) => renderMessages(m, index))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

MessageList.propTypes = {
    statusFlag: PropTypes.bool,
    currentUser: PropTypes.object
}
