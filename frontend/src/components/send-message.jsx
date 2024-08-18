import {PropTypes} from 'prop-types'
import {useWebSocketService} from "../service/websocket-service.jsx";
import {useState} from "react";
import {ChatMessage} from "../model/chat-message.js";

const appMessages = "/app/message"
const appPrivateMessages = "/app/privatemessage"

export const SendMessage = ({user, privateUser}) => {
    const {sendMessage} = useWebSocketService()
    const [inputMessage, setInputMessage] = useState('')

    const onChange = (e) => {
        setInputMessage(e.target.value)
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (inputMessage.trim()) {
            privateUser ? sendPrivateMessage() : sendPublicMessage()
        }
        setInputMessage('')
    }

    const sendPublicMessage = () => {
        const cm = new ChatMessage(user, null, inputMessage, 'NEW_MESSAGE', null)
        sendMessage(appMessages, cm)
    }

    const sendPrivateMessage = () => {
        const cm = new ChatMessage(user, privateUser.id, inputMessage, 'NEW_PRIVATE_MESSAGE', null)
        sendMessage(appPrivateMessages, cm)
    }

    return (
        <>
            <div id="online">
                <p>{user?.username}, you are online!</p>
            </div>
            <div className="row" id="sendmessage">
                <form id="formsendmessage" onSubmit={handleSendMessage}>
                    <div>
                        <label id="messagelabel" className="row" htmlFor="send">
                            {privateUser ? `Send a private message to user: ${privateUser.username}` : 'Send a public message:'}
                        </label>
                        <input type="text" id="inputsendmessage" placeholder="Type your message here..." value={inputMessage} onChange={onChange}/>
                        <button id="send" type="submit">Send</button>
                    </div>
                </form>
            </div>
        </>
    )
}

SendMessage.propTypes = {
    user: PropTypes.object,
    privateUser: PropTypes.object
}