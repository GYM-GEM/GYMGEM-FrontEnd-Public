import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CreditCard, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import axios from "axios";
import PaymentPage from "./PaymentPage";
import { Sparkles } from "lucide-react";
const VITE_API_URL = import.meta.env.VITE_API_URL;


// ============================================================================
// ORDER MANAGEMENT LOGIC
// ============================================================================

const ORDERS_KEY = 'user_orders';
const ENROLLED_COURSES_KEY = 'enrolled_courses';

/**
 * Generate unique order ID
 * @returns {string} Unique order ID
 */
const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Get all orders from localStorage
 * @returns {Array} Array of all orders
 */
const getAllOrders = () => {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};


const getEnrolledCourses = () => {
  const token = localStorage.getItem("access");
  try {
    const response = axios.get(`${VITE_API_URL}/api/courses/enrollments/my-enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error reading enrollments:', error);
    return [];
  }
};

/**
 * Create a new order
 * @param {string} userId - User ID
 * @param {Object} courseData - Course information
 * @param {Object} paymentInfo - Payment details
 * @returns {Object} Created order object
 */
export const createOrder = (userId, courseData, paymentInfo) => {
  const order = {
    orderId: generateOrderId(),
    userId,
    course: {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description,
      img: courseData.img,
      price: courseData.price,
      category: courseData.category,
      level: courseData.level,
    },
    amount: courseData.price || 49.99,
    paymentMethod: paymentInfo.method,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  // Save order to localStorage
  try {
    const orders = getAllOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Also enroll user in course
    enrollUserInCourse(userId, courseData.id, courseData);

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get orders for a specific user
 * @param {string} userId - User ID
 * @returns {Array} Array of user's orders
 */
export const getUserOrders = (userId) => {
  try {
    const orders = getAllOrders();
    return orders.filter(order => order.userId === userId);
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};

/**
 * Get a specific order by ID
 * @param {string} orderId - Order ID
 * @returns {Object|null} Order object or null if not found
 */
export const getOrderById = (orderId) => {
  try {
    const orders = getAllOrders();
    return orders.find(order => order.orderId === orderId) || null;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
};

/**
 * Enroll user in a course
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {Object} courseData - Full course data
 * @returns {boolean} Success status
 */
export const enrollUserInCourse = (userId, courseId, courseData) => {
  try {
    const enrollments = getEnrolledCourses();

    // Check if already enrolled
    const isAlreadyEnrolled = enrollments.some(
      enrollment => enrollment.userId === userId && enrollment.courseId === courseId
    );

    if (isAlreadyEnrolled) {
      console.log('User already enrolled in this course');
      return true;
    }

    // Add enrollment
    enrollments.push({
      userId,
      courseId,
      course: courseData,
      enrolledAt: new Date().toISOString(),
      progress: 0,
    });

    localStorage.setItem(ENROLLED_COURSES_KEY, JSON.stringify(enrollments));
    return true;
  } catch (error) {
    console.error('Error enrolling user:', error);
    return false;
  }
};

/**
 * Get courses enrolled by a specific user
 * @param {string} userId - User ID
 * @returns {Array} Array of enrolled courses
 */
export const getUserEnrolledCourses = (userId) => {
  try {
    const enrollments = getEnrolledCourses();
    return enrollments
      .filter(enrollment => enrollment.userId === userId)
      .map(enrollment => enrollment.course);
  } catch (error) {
    console.error('Error getting user enrolled courses:', error);
    return [];
  }
};

/**
 * Check if user is enrolled in a course
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {boolean} True if enrolled
 */
export const isUserEnrolled = (userId, courseId) => {
  try {
    const enrollments = getEnrolledCourses();
    return enrollments.some(
      enrollment => enrollment.userId === userId && enrollment.courseId === courseId
    );
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
};

/**
 * Simulate payment processing
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async (paymentData) => {
  // Simulate API call delay (1.5-2.5 seconds)
  const delay = 1500 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate 95% success rate
  if (Math.random() > 0.05) {
    return {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: 'Payment processed successfully',
    };
  }

  // Simulate failure
  throw new Error('Payment declined. Please check your payment details and try again.');
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, user, iframeUrl, paymentId, type, gems, price, returnUrl } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Check if this is a gems purchase
  const isGemsPurchase = type === 'gems';

  // Redirect if no course or user data (unless it's a gems purchase)
  useEffect(() => {
    if (!user || (!course && !isGemsPurchase)) {
      navigate('/courses');
    }
  }, [course, user, navigate, isGemsPurchase]);

  if (!user || (!course && !isGemsPurchase)) {
    return null;
  }

  const coursePrice = course ? (parseFloat(course.price) || 49.99) : 0;
  const gemsPrice = isGemsPurchase ? price : 0;
  const totalPrice = isGemsPurchase ? gemsPrice : coursePrice;
  const tax = totalPrice * 0.1; // 10% tax
  const total = totalPrice + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (paymentMethod === "credit_card") {
      if (!formData.cardNumber || formData.cardNumber.length < 16) {
        setError("Please enter a valid 16-digit card number");
        return false;
      }
      if (!formData.cardName) {
        setError("Please enter cardholder name");
        return false;
      }
      if (!formData.expiryDate) {
        setError("Please enter expiry date");
        return false;
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        setError("Please enter a valid CVV");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Process payment
      const paymentResult = await processPayment({
        method: paymentMethod,
        amount: total,
        ...formData
      });

      if (paymentResult.success) {
        if (isGemsPurchase) {
          // Update GEMS balance
          const currentBalance = parseInt(localStorage.getItem("gems_balance") || "0", 10);
          const newBalance = currentBalance + gems;
          localStorage.setItem("gems_balance", newBalance.toString());
          window.dispatchEvent(new Event('gemsUpdated'));

          // Navigate back or to success
          if (returnUrl) {
            navigate(returnUrl, { state: { success: true } });
          } else {
            navigate('/courses', { state: { success: true, message: `Added ${gems} GEMS to your account!` } });
          }
          return;
        }

        // Enroll user in course via API (for normal purchases)
        const token = localStorage.getItem("access");
        try {
          const enrollmentResponse = await axios.post(
            `${VITE_API_URL}/api/courses/enrollments/${course.id}/enroll/`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Enrollment successful:", enrollmentResponse.data);
        } catch (enrollError) {
          console.error("Enrollment API error:", enrollError);
          // Continue anyway with local enrollment
        }

        // Create order locally
        const order = createOrder(user.id, course, {
          method: paymentMethod,
          transactionId: paymentResult.transactionId
        });

        // Navigate to success page
        navigate(`/order-success/${order.orderId}`, {
          state: { order }
        });
      }
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${iframeUrl ? '' : 'max-w-7xl'}`}>
          {/* Header */}
          <div className={iframeUrl ? "mb-8 max-w-4xl mx-auto" : "mb-8"}>
            <Link
              to={isGemsPurchase ? "/" : `/courses/${course?.id || ''}`}
              className="text-[#FF8211] text-sm font-medium hover:underline poppins-regular inline-flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {isGemsPurchase ? 'Back to Home' : 'Back to Course'}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 bebas-regular">
              Checkout
            </h1>
            <p className="text-gray-600 poppins-regular mt-2">
              {isGemsPurchase ? 'Complete your GEMS purchase' : 'Complete your purchase securely'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className={(iframeUrl || isGemsPurchase) ? "lg:col-span-3 max-w-4xl mx-auto w-full" : "lg:col-span-2"}>
              {isGemsPurchase ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden group">
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-orange-100 rounded-2xl">
                        <Sparkles className="w-8 h-8 text-[#FF8211]" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 bebas-regular">GEMS Package</h2>
                        <p className="text-gray-500 poppins-regular">Boost your account balance</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Amount to Add</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-gray-900 poppins-bold">{gems?.toLocaleString()}</span>
                          <span className="text-lg font-bold text-[#FF8211]">GEMS</span>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Total Price</p>
                        <div className="flex items-center gap-1">
                          <span className="text-3xl font-bold text-gray-900 poppins-bold">${gemsPrice?.toFixed(2)}</span>
                          <span className="text-sm font-medium text-gray-500 poppins-regular">(USD)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6">
                    Order Summary
                  </h2>

                  <div className="flex gap-4 mb-6">
                    <img
                      src={course.img || "https://via.placeholder.com/200x112"}
                      alt={course.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 poppins-medium mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 poppins-regular line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700 poppins-regular">
                      <span>Subtotal</span>
                      <span>${price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 poppins-regular">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 poppins-semibold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-[#FF8211]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              <PaymentPage
                total={total}
                iframeUrl={iframeUrl}
                paymentId={paymentId}
                course={course}
                user={user}
              />
            </div>

            {/* Sidebar Info */}
            {!iframeUrl && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 bebas-regular mb-4">
                    What's Included
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-700 poppins-regular">
                    <li className="flex items-start gap-2">
                      <span className="text-[#86ac55]">✓</span>
                      <span>Lifetime access to course content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#86ac55]">✓</span>
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#86ac55]">✓</span>
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#86ac55]">✓</span>
                      <span>Direct trainer support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#86ac55]">✓</span>
                      <span>30-day money-back guarantee</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
