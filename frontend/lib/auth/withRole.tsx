
import React from "react";
import { Role } from "./roles";

const useAuth = () => {
    if (typeof window === "undefined") return { role: "STUDENT" as Role, user: null };
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            const role = user.role?.toUpperCase() as Role || "STUDENT";
            return { role, user };
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
        }
    }
    return { role: "STUDENT" as Role, user: null };
};

interface WithRoleProps {
    allowedRoles: Role[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<WithRoleProps> = ({ allowedRoles, children, fallback = null }) => {
    const { role } = useAuth();

    if (!allowedRoles.includes(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export function withRole<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles: Role[]
) {
    return function WrappedComponent(props: P) {
        const { role } = useAuth();

        if (!allowedRoles.includes(role)) {
            return null; // or a customized access denied component
        }

        return <Component {...props} />;
    };
}
