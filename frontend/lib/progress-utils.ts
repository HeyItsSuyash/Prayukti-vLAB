/**
 * Utility for managing student progress and names in localStorage.
 */

export const PROGRESS_STORAGE_KEY = "vlab_progress";
export const STUDENT_NAME_KEY = "studentName";

/**
 * Gets the completion percentage for a specific lab.
 * @param subject - The subject key (e.g., 'mpmc', 'dld')
 * @param labId - The lab ID (number or string)
 */
export const getLabProgress = (subject: string, labId: string | number): number => {
    if (typeof window === "undefined") return 0;
    const s = subject.toLowerCase();
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}");
    return allProgress[s]?.[labId] || 0;
};

/**
 * Updates the completion percentage for a specific lab.
 * @param subject - The subject key
 * @param labId - The lab ID
 * @param percentage - New completion percentage (0-100)
 */
export const updateLabProgress = (subject: string, labId: string | number, percentage: number) => {
    if (typeof window === "undefined") return;
    const s = subject.toLowerCase();
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}");

    if (!allProgress[s]) {
        allProgress[s] = {};
    }

    // Only update if the new percentage is higher (don't lose progress)
    const currentProgress = allProgress[s][labId] || 0;
    if (percentage > currentProgress) {
        allProgress[s][labId] = percentage;
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
    }
};

/**
 * Gets all progress for a specific subject.
 */
export const getSubjectProgress = (subject: string): Record<string | number, number> => {
    if (typeof window === "undefined") return {};
    const s = subject.toLowerCase();
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}");
    return allProgress[s] || {};
};

/**
 * Gets the student's name from storage.
 */
export const getStudentName = (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STUDENT_NAME_KEY) || "";
};

/**
 * Sets the student's name in storage.
 */
export const setStudentName = (name: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STUDENT_NAME_KEY, name);
};
/**
 * Checks if all labs for a subject are 100% completed.
 * @param subject - The subject key
 * @param labIds - Array of lab IDs for this subject
 */
export const isSubjectCompleted = (subject: string, labIds: (string | number)[]): boolean => {
    if (typeof window === "undefined" || labIds.length === 0) return false;
    const s = subject.toLowerCase();
    const progress = getSubjectProgress(s);

    return labIds.every(id => (progress[id] || 0) === 100);
};

/**
 * Gets the overall completion percentage for a subject.
 */
export const getSubjectCompletionRate = (subject: string, labIds: (string | number)[]): number => {
    if (typeof window === "undefined" || labIds.length === 0) return 0;
    const s = subject.toLowerCase();
    const progress = getSubjectProgress(s);
    const completedCount = labIds.filter(id => (progress[id] || 0) === 100).length;

    return Math.round((completedCount / labIds.length) * 100);
};
