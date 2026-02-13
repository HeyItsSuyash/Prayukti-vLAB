export type Role = "STUDENT" | "TEACHER" | "ADMIN" | "FOREIGN";

export interface Permission {
    action: string;
    resource: string;
}

export const ROLES: Record<string, Role> = {
    STUDENT: "STUDENT",
    TEACHER: "TEACHER",
    ADMIN: "ADMIN",
    FOREIGN: "FOREIGN",
};

export const PERMISSIONS: Record<Role, string[]> = {
    STUDENT: [
        "lab:view",
        "simulation:run",
        "assessment:attempt",
        "dashboard:view_student",
    ],
    TEACHER: [
        "lab:view",
        "simulation:run",
        "student:view_progress",
        "exam:proctor",
        "dashboard:view_teacher",
    ],
    ADMIN: [
        "lab:manage",
        "user:manage",
        "exam:configure",
        "dashboard:view_admin",
    ],
    FOREIGN: [
        "lab:view_public",
        "event:view",
    ],
};

export function hasPermission(role: Role, action: string): boolean {
    return PERMISSIONS[role]?.includes(action) ?? false;
}
export interface Permissions {
    canViewLabs: boolean;
    canRunSimulations: boolean;
    canAttemptAssessments: boolean;
    canViewProgress: boolean;
    canGrade: boolean;
    canConductExams: boolean;
    canManageLabs: boolean;
    canManageUsers: boolean;
    isReadOnly: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, Permissions> = {
    STUDENT: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: true,
        canViewProgress: true,
        canGrade: false,
        canConductExams: false,
        canManageLabs: false,
        canManageUsers: false,
        isReadOnly: false,
    },
    TEACHER: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: false,
        canViewProgress: true,
        canGrade: true,
        canConductExams: true,
        canManageLabs: false,
        canManageUsers: false,
        isReadOnly: false,
    },
    ADMIN: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: true,
        canViewProgress: true,
        canGrade: true,
        canConductExams: true,
        canManageLabs: true,
        canManageUsers: true,
        isReadOnly: false,
    },
    FOREIGN: {
        canViewLabs: true,
        canRunSimulations: true,
        canAttemptAssessments: false,
        canViewProgress: false,
        canGrade: false,
        canConductExams: false,
        canManageLabs: false,
        canManageUsers: false,
        isReadOnly: true,
    },
};
