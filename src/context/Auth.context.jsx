import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import { useEffect } from "react";
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom";
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAunthenticated] = useState(false);
    const [registerErrors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true)
    // 🔹 Función que extrae los mensajes de error sin importar el formato
    const getErrorMessages = (errorResponse) => {
        try {
            const data = errorResponse?.data;

            if (!data) return ["Unknown error"];

            // Caso 1: Si viene como string que contiene JSON (ejemplo del password)
            if (typeof data[0] === "string" && data[0].includes("{")) {
                const parsed = JSON.parse(data[0]);
                return parsed.map((err) => err.message);
            }

            // Caso 2: Si ya viene como string simple (ejemplo del email)
            if (typeof data[0] === "string") {
                return data;
            }

            // Caso 3: Si viene como objeto con "message"
            if (typeof data[0] === "object" && data[0].message) {
                return data.map((err) => err.message);
            }

            return ["Unexpected error format"];
        } catch (e) {
            console.error("Error parsing:", e);
            return ["Error reading server response"];
        }
    };

    const singup = async (user) => {
        try {
            setErrors([]); 
            const res = await registerRequest(user);
              return res;
        } catch (error) {

            // Usa la función para obtener los mensajes limpios
            const messages = getErrorMessages(error.response);
            setErrors(messages);
        }
    };

    const singin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res)
            setIsAunthenticated(true);
            setUser(res.data);
            return res;

        } catch (error) {
            const messages = getErrorMessages(error.response);
            setErrors(messages);
        }
    }

    const logOut = () => {
        Cookies.remove("token")
        setIsAunthenticated(false)
        setUser(null)
        Navigate("/login")
    }

    useEffect(() => {
        if (registerErrors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [registerErrors])

    useEffect(() => {
        async function checkLogin() {

            const cookie = Cookies.get()
            if (!cookie.token) 
            {
                setIsAunthenticated(false)
                setUser(null)
                setLoading(false)

                return
            }
                try {
                    const res = await verifyTokenRequest(Cookies.token)
                    if (!res.data) {
                        setIsAunthenticated(false)
                        setLoading(false)
                        return
                    }
                    setIsAunthenticated(true)
                    setUser(res.data)
                    setLoading(false)
                } catch (error) {
                    setIsAunthenticated(false)
                    setUser(null)
                    setLoading(false)

                }
            
        }
        checkLogin();
    }, [])



return (
    <AuthContext.Provider
        value={{ singup, singin, user, isAuthenticated, registerErrors, loading,logOut}}
    >
        {children}
    </AuthContext.Provider>
);
};
