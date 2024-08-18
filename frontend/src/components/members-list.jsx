import '../chat.css'
import {useEffect, useState} from "react";
import {PropTypes} from 'prop-types'
import {useWebSocketService} from "../service/websocket-service.jsx";

const privatePreUrl = "/user/";
const userUrl = "/webchatUsers";

export const MembersList = ({statusFlag, currentUser, onMemberSelect}) => {
    const [connectedUsers, setConnectedUsers] = useState([])
    const [activeIndex, setActiveIndex] = useState(-1)
    const {subscribeToTopic} = useWebSocketService()

    const handleMemberClick = (index, usr) => {
        setActiveIndex(prevIndex => index === prevIndex ? -1 : index)
        onMemberSelect(index === activeIndex ? null : usr)
    }

    useEffect(() => {
        const onMessageReceived = (payload) => {
            const users = JSON.parse(payload.body);
            setConnectedUsers(users);
        }
        statusFlag ? subscribeToTopic(privatePreUrl + currentUser.id + userUrl, onMessageReceived) : setConnectedUsers([])
    }, [statusFlag]);

    return (
        <div className="members">
            <p>Members List:</p>
            <ul id="userslist">
                {connectedUsers.map((usr, index) => {
                        if (usr.username !== currentUser?.username) {
                            return <li key={index} className={index === activeIndex ? 'selected' : ''}
                                       onClick={() => handleMemberClick(index, usr)}>{usr.username}
                            </li>
                        }
                    }
                )}
            </ul>
        </div>
    )
}

MembersList.propTypes = {
    statusFlag: PropTypes.bool,
    currentUser: PropTypes.object,
    onMemberSelect: PropTypes.func
}