import {useEffect, useState} from "react";
import '../chat.css'
import {MembersList} from "./members-list.jsx";
import {MessageList} from "./message-list.jsx";
import {useWebSocketService} from "../service/websocket-service.jsx";
import {User} from "../model/user.js";
import {SendMessage} from "./send-message.jsx";
import {v4 as uuid} from 'uuid'

const appUsers = "/app/user";

export const WebsocketChat = () => {
    const [connectedFlag, setConnectedFlag] = useState(false);
    const [userName, setUserName] = useState('')
    const [user, setUser] = useState(null)
    const [privateUser, setPrivateUser] = useState(null)
    const {connect, disconnect, sendMessage} = useWebSocketService()

    useEffect(() => {
        return () => disconnect(setConnectedFlag)
    }, []);

    useEffect(() => {
        connectedFlag && sendMessage(appUsers, user)
    }, [connectedFlag, user]);

    const handleConnectClick = (e) => {
        e.preventDefault()
        if(userName.trim()) {
            connect(setConnectedFlag)
            setUser(new User(uuid(), userName))
        }
        setUserName('')
    }

    const handleDisconnetClick = () => {
        disconnect(setConnectedFlag)
        setUserName('')
    }

    return (
        <div>
            <div className="header">
                <div className="center">
                    <h2>Spring Boot Tutorial Web Chat</h2>
                </div>
            </div>
            <div className="username">
                <div className="row">
                    <h3>WebSocket connection:</h3>
                    <button id="disconnect" onClick={handleDisconnetClick} disabled={!connectedFlag}>
                        Disconnect
                    </button>
                </div>
                <div className="row">
                    <label className="row" htmlFor="connect">Username:</label>
                    <form onSubmit={handleConnectClick}>
                        <input type="text" id="username" disabled={connectedFlag}
                               onChange={(e) => setUserName(e.target.value)} value={userName}
                               placeholder="Your username here..."/>
                        <button id="connect" type={'submit'} disabled={connectedFlag}>Connect</button>
                    </form>
                </div>
                {connectedFlag && <SendMessage user={user} privateUser={privateUser}/>}
            </div>
            <MembersList statusFlag={connectedFlag} currentUser={user} onMemberSelect={setPrivateUser}/>
            <MessageList statusFlag={connectedFlag} currentUser={user}/>
        </div>
    );
}