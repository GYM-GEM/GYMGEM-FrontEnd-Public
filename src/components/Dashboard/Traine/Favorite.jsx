import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Award, Globe, ShoppingBag, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import NavTraineDash from "../../Dashboard/Traine/NavTraineDash";
import { isUserEnrolled } from "../../BuyNow/Checkout";
import axiosInstance from "../../../utils/axiosConfig";

// Helpers for mapping IDs to names
const getCategoryName = (id) => {
  const categories = {
    1: "Strength Training",
    2: "Cardio & Endurance",
    3: "Flexibility & Mobility",
    4: "Bodyweight Only",
    5: "Yoga",
    6: "Pilates",
    7: "Recovery & Prehab",
    8: "Meditation & Breathwork",
    9: "Beginner's Journey",
    10: "Fat Loss & Toning",
    11: "Build Muscle Mass",
    12: "Prenatal & Postnatal",
    13: "Dance Fitness",
    14: "Sport-Specific Training",
    15: "Equipment Specific"
  };
  return categories[id] || "Fitness";
};

const getLevelName = (id) => {
  const levels = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };
  return levels[id] || "All Levels";
};

// ============================================================================
// FAVORITES MANAGEMENT LOGIC (Legacy / LocalStorage helpers kept for compatibility)
// ============================================================================
const FAVORITES_KEY = 'favorites_courses';

export const getFavoritesLocal = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    return [];
  }
};

export const addToFavorites = (course) => {
  try {
    const favorites = getFavoritesLocal();
    const exists = favorites.some(fav => String(fav.id) === String(course.id));
    if (exists) return false;
    favorites.push(course);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    return false;
  }
};

export const removeFromFavorites = (courseId) => {
  try {
    const favorites = getFavoritesLocal();
    const filtered = favorites.filter(fav => String(fav.id) !== String(courseId));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    return false;
  }
};

export const isFavorite = (courseId) => {
  try {
    const favorites = getFavoritesLocal();
    return favorites.some(fav => String(fav.id) === String(courseId));
  } catch (error) {
    return false;
  }
};

// ============================================================================
// FAVORITE COMPONENT
// Displays all saved courses with management options
// ============================================================================

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removedIds, setRemovedIds] = useState(new Set());

  const getFavorites = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/courses/enrollments/my-wishlist/`);
      // Expected response: array of objects { id, enrollment_date, status, course_details: {...}, ... }
      setFavorites(response.data);
      setRemovedIds(new Set()); // Reset on refresh
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (courseId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem('access');

    if (!user || !token) {
      return;
    }

    // Toggle local visual state (Delayed Removal)
    setRemovedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId); // Undo removal
      } else {
        newSet.add(courseId); // Mark for removal
      }
      return newSet;
    });

    try {
      await axiosInstance.post(
        `/api/courses/enrollments/${courseId}/add-to-wishlist/`,
        {}
      );

      // Update legacy local storage if needed
      // Logic: if it WAS in removed set (so we added it back), we add to LS. 
      // If we just added it to removed set, we remove from LS.
      // Since state update is async, we can check the *new* state we just calculated logically
      // But simpler to just rely on isFavorite check after a small delay or ignore legacy sync here as it's secondary.
      // For safety, let's sync based on the action we just took.

      // However, since we don't have the full course object here easily for addToFavorites (legacy), 
      // and we are moving away from LS, it might be safer to skip LS update or try best effort.
      if (isFavorite(courseId)) {
        removeFromFavorites(courseId);
      } else {
        // Can't add to LS without full object easily, skipping adding back to LS for now 
        // to avoid inconsistencies. LS is legacy.
      }

    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      // Revert visual state on error
      setRemovedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(courseId)) {
          newSet.delete(courseId);
        } else {
          newSet.add(courseId);
        }
        return newSet;
      });
      alert("Failed to update favorites. Please try again.");
    }
  };

  // Load user and favorites on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    getFavorites();
  }, []);

  // Check if course is purchased
  const isPurchased = (courseId) => {
    if (!currentUser) return false;
    return isUserEnrolled(currentUser.id, courseId);
  };

  return (
    <>
      <NavTraineDash />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 bebas-regular mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600 poppins-regular">
              Courses you've saved for later
            </p>
          </div>

          {/* Favorites Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF8211]" />
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => {
                const course = item.course_details;
                // If course_details is missing for some reason, skip or handle safely
                if (!course) return null;

                const purchased = isPurchased(course.id);
                const isRemoved = removedIds.has(course.id);

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col ${purchased
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                      : 'bg-white border border-gray-200'
                      }`}
                  >
                    {/* Course Image */}
                    <div className="relative">
                      <img
                        src={course.cover || "https://via.placeholder.com/400x225"}
                        alt={course.title}
                        className={`w-full h-48 object-cover ${purchased ? 'opacity-90' : ''}`}
                      />
                      {/* Purchased Badge */}
                      {purchased && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold poppins-regular flex items-center gap-1.5 shadow-lg">
                          <CheckCircle className="w-4 h-4" />
                          Purchased
                        </div>
                      )}

                      {/* Remove from Favorites Button */}
                      <button
                        onClick={() => handleToggleFavorite(course.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-[#FF8211] hover:text-white transition-colors group z-10"
                        aria-label={isRemoved ? "Add to favorites" : "Remove from favorites"}
                        title={isRemoved ? "Add to favorites" : "Remove from favorites"}
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors cursor-pointer ${isRemoved
                              ? "text-[#FF8211] fill-none group-hover:fill-[#FF8211]"
                              : "fill-[#FF8211] text-[#FF8211] group-hover:fill-white group-hover:text-white"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Course Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#FF8211]/10 text-[#FF8211] rounded-lg text-xs font-medium poppins-regular">
                          {getCategoryName(course.category)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium poppins-regular flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {getLevelName(course.level)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 bebas-regular mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 poppins-regular text-sm mb-4 line-clamp-2 flex-grow">
                        {course.description || "Master the fundamentals and transform your approach to fitness"}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="flex text-[#FF8211]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.round(course.average_rating || 0) ? "fill-current" : "text-gray-300"}`} strokeWidth={0} />
                            ))}
                          </div>
                          <span className="text-gray-700 poppins-regular ml-1">{course.average_rating ? Number(course.average_rating).toFixed(1) : "New"}</span>
                        </div>
                        {course.language && (
                          <div className="flex items-center gap-1 text-gray-600 poppins-regular">
                            <Globe className="w-3 h-3" />
                            <span>{course.language}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-600 poppins-regular">
                          <ShoppingBag className="w-3 h-3" />
                          <span>{course.students_enrolled || 0} enrolled</span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        {purchased ? (
                          <>
                            <div className="flex items-center gap-2 text-green-700 poppins-medium text-sm">
                              <CheckCircle className="w-5 h-5" />
                              <span>You own this course</span>
                            </div>
                            <Link
                              to={`/courses/${course.id}/learn`}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium poppins-regular text-sm hover:bg-green-700 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                            >
                              Start Learning
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-2xl font-bold text-[#FF8211] bebas-regular">
                                ${course.price || "49.99"}
                              </span>
                            </div>
                            <Link
                              to={`/courses/${course.id}`}
                              className="px-4 py-2 bg-[#FF8211] text-white rounded-lg font-medium poppins-regular text-sm hover:bg-[#ff7906] transition-colors shadow-sm cursor-pointer"
                            >
                              View Details
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 bebas-regular mb-3">
                No favorites yet
              </h2>
              <p className="text-gray-600 poppins-regular mb-6 text-center max-w-md">
                Start adding courses to your favorites to keep track of the ones you're interested in!
              </p>
              <Link
                to="/courses"
                className="px-6 py-3 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular text-lg hover:bg-[#ff7906] transition-colors shadow-sm flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorite;
