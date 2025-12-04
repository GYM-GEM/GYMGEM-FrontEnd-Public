import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useEffect, useRef } from "react";

/**
 * ProtectedRoute component that guards routes based on authentication and profile permissions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string} props.requiredProfile - Required profile type (e.g., "trainer", "trainee", "gym", "store")
 */
const ProtectedRoute = ({ children, requiredProfile }) => {
    const location = useLocation();
    const { showToast } = useToast();
    const toastShownRef = useRef(false);

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Check 1: User must be logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check 2: If requiredProfile is specified, check if user has that profile
    if (requiredProfile) {
        const normalizedRequired = requiredProfile.toLowerCase();

        // Check if user has this profile type at all
        const hasProfile = user.profiles?.some(
            p => p.type.toLowerCase() === normalizedRequired
        );

        if (!hasProfile) {
            // User doesn't have this profile - redirect to create profile page
            useEffect(() => {
                if (!toastShownRef.current) {
                    showToast(
                        `You need to create a ${requiredProfile} profile to access this page.`,
                        { type: "error" }
                    );
                    toastShownRef.current = true;
                }
            }, [requiredProfile]);

            return <Navigate to="/role" state={{ from: location, requiredProfile }} replace />;
        }

        // Check if user has selected the correct profile
        const currentProfile = user.profiles?.find(p => p.id === user.current_profile);

        if (currentProfile?.type.toLowerCase() !== normalizedRequired) {
            // User has the profile but hasn't selected it
            useEffect(() => {
                if (!toastShownRef.current) {
                    showToast(
                        `Please switch to your ${requiredProfile} profile to access this page.`,
                        { type: "warning" }
                    );
                    toastShownRef.current = true;
                }
            }, [requiredProfile]);

            // Redirect to home or show a profile switch prompt
            return <Navigate to="/" state={{ from: location, requiredProfile }} replace />;
        }
    }

    // All checks passed - render the protected component
    return children;
};

export default ProtectedRoute;
