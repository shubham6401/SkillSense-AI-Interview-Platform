import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role || "candidate";
        if (!allowedRoles.includes(userRole)) {
            return userRole === "recruiter"
                ? <Navigate to="/recruiter/dashboard" replace />
                : <Navigate to="/dashboard" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;