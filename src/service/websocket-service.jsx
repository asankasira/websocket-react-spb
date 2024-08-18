import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";

const url = "http://localhost:8080/spring-boot-tutorial";
let client = null

export const useWebSocketService = () => {
    const connect = (setConnected) => {
        const socket = new SockJS(url);
        client = new Client({webSocketFactory: () => socket, reconnectDelay: 3000});
        client.onConnect = () => {
            console.log('Connected to web socket')
            setConnected(true)
        }

        client.onStompError = (frame) => {
            console.error('Error connecting to WebSocket', frame);
        }

        client.onWebSocketClose = () => {
            setConnected(false)
            console.warn('WebSocket is closed')
        }
        client.activate()
    };

    const disconnect = (setConnected) => {
        client?.deactivate().then(() => {
            setConnected(false)
            client = null
            console.log("Disconnected from WS server....");
        });
    }

    const subscribeToTopic = (topicName, callbackFn) => {
        if (!client || !client.connected) {
            console.warn('Cannot subscribe to topic: ', topicName)
            return
        }
        client.subscribe(topicName, callbackFn);
    }

    const sendMessage = (destination, messageContent) => {
        if (client && messageContent) {
            client.publish({destination, body: JSON.stringify(messageContent)})
        }
    }

    return {connect, disconnect, subscribeToTopic, sendMessage}
}