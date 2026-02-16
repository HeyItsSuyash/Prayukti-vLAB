
import React from "react";
import { Role } from "./roles";

// Mocking useAuth for now. Replace with actual auth hook later.
const useAuth = () => {
    return { role: "STUDENT" as Role };
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
