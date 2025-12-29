import { getCurrentProfileType, getUser } from "./auth";

/**
 * Extracts relevant user context for the AI chatbot.
 * Returns an object containing role, goal, level, gems, and courses.
 */
export const getUserContext = () => {
    try {
        const user = getUser();
        const gemsBalance = localStorage.getItem("gems_balance") || "0";
        
        // Extract Name
        const name = user?.first_name || user?.username || "Guest";

        // Basic Role extraction
        const role = getCurrentProfileType() || "Guest";

        // Goal and Level extraction
        const goal = user?.goal || "General Fitness";
        const level = user?.level || "Beginner";

        // Course extraction
        const courses = "Check dashboard for details"; 
        
        // Navigation Context
        const currentPath = window.location.pathname;
        const pageTitle = document.title;

        return {
            name,
            role,
            goal,
            level,
            gems: gemsBalance,
            courses,
            currentPath,
            pageTitle
        };
    } catch (error) {
        console.error("Error extracting user context:", error);
        return {
            name: "Guest",
            role: "Guest",
            goal: "General Fitness",
            level: "Beginner",
            gems: "0",
            courses: "None",
            currentPath: "Unknown",
            pageTitle: "Unknown"
        };
    }
};

/**
 * Formats the user context into a string for prompt injection.
 */
export const formatUserContextForPrompt = (context) => {
    return `
[USER_CONTEXT]
Current User:
- Name: ${context.name}
- Role: ${context.role}
- Goal: ${context.goal}
- Level: ${context.level}
- Gems Balance: ${context.gems}
- Subscribed Courses: ${context.courses}
- Current Page: ${context.pageTitle} (${context.currentPath})
`;
};
