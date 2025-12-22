import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  return !!token;
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

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

export const hasProfile = (type) => {
  const profiles = getProfiles();
  if (!Array.isArray(profiles) || profiles.length === 0) return false;

  return profiles.some(p => p.type?.toLowerCase() === type.toLowerCase());
};

export const getProfile = (type) => {
  const profiles = getProfiles();
  if (!Array.isArray(profiles)) return null;

  return profiles.find(p => p.type?.toLowerCase() === type.toLowerCase()) || null;
};

export const getCurrentProfileId = () => {
  const user = getUser();
  return user?.current_profile || null;
};

export const getCurrentProfile = () => {
  const user = getUser();
  const currentProfileId = user?.current_profile;

  if (!currentProfileId) return null;

  const profiles = getProfiles();
  return profiles.find(p => p.id === currentProfileId) || null;
};

export const getCreatedProfileTypes = () => {
  const profiles = getProfiles();
  // Capitalize first letter to match the dropdown format
  return profiles.map(p => {
    const type = p.type || "";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  });
};

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

export const getCurrentProfileType = () => {
  const profile = getCurrentProfile();
  return profile?.type || null;
};

export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // Get current time in seconds (not milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);

    // If current time is past expiration, token is expired
    return currentTime > decoded.exp;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Assume expired on error for safety
  }
};

export const getTokenExpirationTime = (token) => {
  try {
    const decoded = decodeToken(token);
    return decoded?.exp || null;
  } catch (error) {
    console.error("Error getting token expiration time:", error);
    return null;
  }
};

export const getTokenTimeRemaining = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime; // Positive = time left, Negative = expired
  } catch (error) {
    console.error("Error getting token time remaining:", error);
    return 0;
  }
};

export const isAccessTokenValid = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;
  return !isTokenExpired(token);
};

export const isRefreshTokenValid = () => {
  const token = localStorage.getItem("refresh");
  if (!token) return false;
  return !isTokenExpired(token);
};

export const checkTokensStatus = () => {
  const accessToken = localStorage.getItem("access");
  const refreshToken = localStorage.getItem("refresh");

  const accessTokenExpiresIn = accessToken ? getTokenTimeRemaining(accessToken) : 0;
  const refreshTokenExpiresIn = refreshToken ? getTokenTimeRemaining(refreshToken) : 0;

  return {
    // Are tokens valid?
    accessTokenValid: isAccessTokenValid(),
    refreshTokenValid: isRefreshTokenValid(),

    // How much time left?
    accessTokenExpiresIn,  // seconds (negative if expired)
    refreshTokenExpiresIn,  // seconds (negative if expired)

    // Should we refresh proactively?
    // If access token expires in < 5 minutes but refresh is still good
    needsRefresh: accessTokenExpiresIn < 300 && refreshTokenExpiresIn > 0,

    // Both tokens dead? Must logout
    fullyExpired: !isAccessTokenValid() && !isRefreshTokenValid(),
  };
};
