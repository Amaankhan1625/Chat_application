    import { createContext, useEffect, useState } from "react";
    import axios from "axios";
    import toast from "react-hot-toast";
    import { io } from "socket.io-client";


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    axios.defaults.baseURL = backendUrl;

    export const AuthContext = createContext();

    export const AuthProvider = ({ children })=>{ 

        const [token, setToken] = useState(localStorage. getItem("token"));
        const [authUser, setAuthUser] = useState(null); 
        const [isAuthChecked, setIsAuthChecked] = useState(false);
        const [onlineUsers, setOnlineUsers] = useState([]);
        const [socket, setSocket] = useState(null);

        //check if the user is authenticated and set the authUser state
        const checkAuth = async () => {
            try {
                const {data} = await axios.get("/api/user/check")
                if(data.success) {
                    setAuthUser(data.user);
                }
            }catch (error) {
                localStorage.removeItem("token");
                setToken(null);
                delete axios.defaults.headers.common["token"];
                toast.error(error.message);
                console.error("Error checking authentication:", error);
            } finally {
                setIsAuthChecked(true);
            }
        };

        //login function to handle user login and set socket connection
        const  login= async (state, credentials)=>{
            try {
                const { data } = await axios.post(`/api/user/${state}`, credentials); 

                if (data.success){ 
                        const userData = data.userData || data.user;

                        setAuthUser (userData) ; 

                        connectSocket (userData) ; 

                    axios.defaults.headers.common[ "token"] = data. token; 

                    setToken(data.token) ; 

                    localStorage. setItem("token", data.token) ;

                    toast.success (data.message) ;

                }else{ 
                    toast. error(data.message)  
                }
            }catch (error){
                    toast. error(error.message)  
                }
            }

        //update user function to handle user profile update and set the authUser state
        const updateProfile = async (body) => {
            try{
                const { data } = await axios.put("/api/user/update-profile", body);
                if(data.success){
                        setAuthUser(data.userData || data.user);
                    toast.success("profile updated successfully");
                }
            }catch(error){
                toast.error(error.message); 
            }
        }

        //connect socket function to handle the socket connection and online user update 
        const connectSocket = (userData) =>{
            if(!userData || socket?.connected) return;
            const newSocket = io(backendUrl,{
                query: { userId: userData._id },
            });
            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
            });

            setSocket(newSocket);

            newSocket.on("onlineUsers", (users) => {
                setOnlineUsers(users);
            })
        }

        //logout function to handle user logout and clear the authUser state and socket connection
        const logout = () => {
            localStorage.removeItem("token");
            setAuthUser(null);
            setToken(null);
            setOnlineUsers([]);
            axios.defaults.headers.common["token"] = null;
            toast.success("Logged out successfully");
            socket?.disconnect();
        }

        useEffect(() => {
            if(token){
                axios.defaults.headers.common["token"] = token;
                checkAuth();
            } else {
                setIsAuthChecked(true);
            }
        },[]);

        const value = { 
            axios,
            authUser,
            onlineUsers,
            socket,
            isAuthChecked,
            login,
            logout,
            updateProfile,
        }  
        
        return (
            <AuthContext.Provider value={value}>
            {children} 
            </AuthContext.Provider>
        )
    };



