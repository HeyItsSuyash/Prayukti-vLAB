
import React from "react";
import { Role } from "./roles";

// Reading real auth state from localStorage
const useAuth = () => {
    const [authState, setAuthState] = React.useState<{ role: Role | null; isAuthenticated: boolean }>({
        role: null,
        isAuthenticated: false
    });

    React.useEffect(() => {
        const token = localStorage.getItem("vlab_token");
        const userData = localStorage.getItem("vlab_user");

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setAuthState({
                    role: user.role.toUpperCase() as Role,
                    isAuthenticated: true
                });
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    return authState;
};

interface WithRoleProps {
    allowedRoles: Role[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<WithRoleProps> = ({ allowedRoles, children, fallback = null }) => {
    const { role } = useAuth();

    if (!role || !allowedRoles.includes(role)) {
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

        if (!role || !allowedRoles.includes(role)) {
            return null; // or a customized access denied component
        }

        return <Component {...props} />;
    };
}
