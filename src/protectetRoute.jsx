import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/Auth.context"

function ProtectedRoute() {
    const {loading,user,isAuthenticated}= useAuth()
    if(loading) return <h1> Loading</h1>
    if(!isAuthenticated) return <Navigate to="/login" replace/>;
    return<Outlet/>;
}

export default ProtectedRoute