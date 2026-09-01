import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/Authcontext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // Get all users from sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/message/users");

            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || err.message
            );
        }
    };

    // Get all messages for selected user
    const getMessages = async (selectedUserId) => {
        try {
            const { data } = await axios.get(
                `/api/message/${selectedUserId}`
            );

            if (data.success) {
                setMessages(data.messages);
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || err.message
            );
        }
    };

    // Send message to selected user
    const sendMessage = async (messageData) => {
        try {
            if (!selectedUser) return;

            const { data } = await axios.post(
                `/api/message/send/${selectedUser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    data.message
                ]);
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(
                err.response?.data?.message || err.message
            );
        }
    };

    // Subscribe to new messages
    const subscribeToMessages = () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (
                selectedUser &&
                newMessage.senderId === selectedUser._id
            ) {
                newMessage.seen = true;

                setMessages((prevMessages) => [
                    ...prevMessages,
                    newMessage
                ]);

                axios.put(
                    `/api/message/mark/${newMessage._id}`
                );

            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,

                    [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId]
                            ? prevUnseenMessages[newMessage.senderId] + 1
                            : 1
                }));
            }
        });
    };

    // Unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if (socket) {
            socket.off("newMessage");
        }
    };

    useEffect(() => {
        subscribeToMessages();

        return () => {
            unsubscribeFromMessages();
        };
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};