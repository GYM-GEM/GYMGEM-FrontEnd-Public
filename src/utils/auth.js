/**
 * Checks if the user is currently logged in.
 * Returns true if an access token exists in localStorage.
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  return !!token;
};

/**
 * Retrieves the user object from localStorage.
 * Returns the user object or null if not found.
 */
export const getUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

/**
 * Retrieves the list of profiles from the user object in localStorage.
 * Returns an array of profile objects or an empty array.
 * 
 * Expected localStorage structure:
 * {
 *   id: 38,
 *   username: "username",
 *   email: "email@example.com",
 *   current_profile: 42,
 *   profiles: [
 *     {type: "trainer", id: 42},
 *     {type: "trainee", id: 43}
 *   ]
 * }
 */
export const getProfiles = () => {
  try {
    const user = getUser();
    if (!user || !user.profiles) return [];
    return Array.isArray(user.profiles) ? user.profiles : [];
  } catch (error) {
    console.error("Error retrieving profiles:", error);
    return [];
  }
};

/**
 * Checks if the user has a specific profile type.
 * @param {string} type - The profile type to check (e.g., "trainer", "trainee", "gym", "store")
 * @returns {boolean} - True if the profile exists
 */
export const hasProfile = (type) => {
  const profiles = getProfiles();
  if (!Array.isArray(profiles) || profiles.length === 0) return false;
  
  // Case-insensitive check
  return profiles.some(p => p.type?.toLowerCase() === type.toLowerCase());
};

/**
 * Gets a specific profile by type.
 * @param {string} type - The profile type to retrieve
 * @returns {object|null} - The profile object or null
 */
export const getProfile = (type) => {
  const profiles = getProfiles();
  if (!Array.isArray(profiles)) return null;
  
  return profiles.find(p => p.type?.toLowerCase() === type.toLowerCase()) || null;
};

/**
 * Gets the current active profile ID.
 * @returns {number|null} - The current profile ID or null
 */
export const getCurrentProfileId = () => {
  const user = getUser();
  return user?.current_profile || null;
};

/**
 * Gets the current active profile object.
 * @returns {object|null} - The current profile object or null
 */
export const getCurrentProfile = () => {
  const user = getUser();
  const currentProfileId = user?.current_profile;
  
  if (!currentProfileId) return null;
  
  const profiles = getProfiles();
  return profiles.find(p => p.id === currentProfileId) || null;
};

/**
 * Returns an array of profile type strings that the user has created.
 * Useful for the UserDropdown component.
 * @returns {string[]} - Array of profile types (e.g., ["Trainee", "Trainer", "Gym"])
 */
export const getCreatedProfileTypes = () => {
  const profiles = getProfiles();
  // Capitalize first letter to match the dropdown format
  return profiles.map(p => {
    const type = p.type || "";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  });
};

/**
 * Switches the current active profile.
 * Updates the current_profile field in the user object in localStorage.
 * @param {number} profileId - The ID of the profile to switch to
 * @returns {boolean} - True if successful, false otherwise
 */
export const switchCurrentProfile = (profileId) => {
  try {
    const user = getUser();
    if (!user) {
      console.error("No user found in localStorage");
      return false;
    }

    const profiles = user.profiles || [];
    const profileExists = profiles.some(p => p.id === profileId);

    if (!profileExists) {
      console.error(`Profile with ID ${profileId} not found`);
      return false;
    }

    user.current_profile = profileId;
    localStorage.setItem("user", JSON.stringify(user));
    
    // Dispatch a custom event so components can react to profile changes
    window.dispatchEvent(new CustomEvent('profileChanged', { detail: { profileId } }));
    
    return true;
  } catch (error) {
    console.error("Error switching profile:", error);
    return false;
  }
};

/**
 * Checks if the current active profile has access to a specific profile type.
 * @param {string} requiredType - The required profile type (e.g., "trainer", "trainee", "gym")
 * @returns {boolean} - True if access is granted, false otherwise
 */
export const checkAccess = (requiredType) => {
  try {
    const currentProfile = getCurrentProfile();
    if (!currentProfile) return false;

    // Case-insensitive comparison
    return currentProfile.type?.toLowerCase() === requiredType.toLowerCase();
  } catch (error) {
    console.error("Error checking access:", error);
    return false;
  }
};

/**
 * Gets the type of the current active profile.
 * @returns {string|null} - The profile type or null
 */
export const getCurrentProfileType = () => {
  const profile = getCurrentProfile();
  return profile?.type || null;
};
