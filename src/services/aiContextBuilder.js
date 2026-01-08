import axiosInstance from "../utils/axiosConfig";
import { getCurrentProfileType, getUser } from "../utils/auth";

/**
 * AIContextBuilder
 * Fetches, normalizes, and sanitizes platform data for AI injection.
 */
class AIContextBuilder {
    constructor() {
        this.cache = {
            trainers: null,
            courses: null,
            products: null,
            lastFetch: 0
        };
        this.CACHE_DURATION = 1000 * 60 * 10; // 10 minutes cache for public data
    }

    async getFullContext() {
        try {
            const [userContext, recentRecords, trainers, courses, products, orders] = await Promise.all([
                this.getUserStats(),
                this.getRecentRecords(),
                this.getTrainers(),
                this.getCourses(),
                this.getProducts(),
                this.getPurchaseHistory()
            ]);

            return {
                user: userContext,
                records: recentRecords,
                trainers: trainers.slice(0, 10), // Limit to top 10 for prompt efficiency
                courses: courses.slice(0, 10),
                store: products.slice(0, 10),
                orders: orders.slice(0, 5)
            };
        } catch (error) {
            console.error("AIContextBuilder Error:", error);
            return null;
        }
    }

    async getUserStats() {
        const user = getUser();
        const role = getCurrentProfileType() || "Trainee";
        try {
            const res = await axiosInstance.get('/api/trainees/detail', { skipGlobalLoader: true });
            const data = res.data;
            return {
                name: data.name || user?.username || "Learner",
                role: role,
                goal: data.goal || user?.goal || "General Fitness",
                level: data.level || user?.level || "Beginner",
                balance: parseFloat(data.balance || 0).toFixed(2),
                currency: "GEMs"
            };
        } catch (e) {
            return {
                name: user?.username || "Learner",
                role: role,
                goal: user?.goal || "General Fitness",
                level: user?.level || "Beginner",
                balance: "0.00",
                currency: "GEMs"
            };
        }
    }

    async getRecentRecords() {
        try {
            const res = await axiosInstance.get('/api/trainees/records/', { skipGlobalLoader: true });
            const records = res.data.results || [];
            return records.slice(0, 3).map(r => ({
                date: r.record_date,
                weight: r.weight,
                body_fat: r.body_fat_percentage,
                muscle: r.muscle_mass
            }));
        } catch (e) {
            return [];
        }
    }

    async getTrainers() {
        if (this.cache.trainers && (Date.now() - this.cache.lastFetch < this.CACHE_DURATION)) {
            return this.cache.trainers;
        }
        try {
            const res = await axiosInstance.get('/api/trainers/list', { skipGlobalLoader: true });
            const trainers = (res.data || []).map(t => ({
                id: t.id,
                name: t.name,
                specialties: t.specializations || [],
                rating: t.rating || 5.0,
                price: t.hourly_rate || 0
            }));
            this.cache.trainers = trainers;
            this.cache.lastFetch = Date.now();
            return trainers;
        } catch (e) {
            return [];
        }
    }

    async getCourses() {
        if (this.cache.courses && (Date.now() - this.cache.lastFetch < this.CACHE_DURATION)) {
            return this.cache.courses;
        }
        try {
            const res = await axiosInstance.get('/api/courses/courses/for-trainees', { skipGlobalLoader: true });
            const data = res.data.results || res.data || [];
            const courses = data.map(c => ({
                id: c.id,
                title: c.title,
                category: c.category_name,
                level: c.level_name,
                price: c.price,
                rating: c.average_rating || 0
            }));
            this.cache.courses = courses;
            return courses;
        } catch (e) {
            return [];
        }
    }

    async getProducts() {
        if (this.cache.products && (Date.now() - this.cache.lastFetch < this.CACHE_DURATION)) {
            return this.cache.products;
        }
        try {
            const res = await axiosInstance.get('/api/stores/items', { skipGlobalLoader: true });
            const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
            const products = data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                stock: p.total_quantity
            }));
            this.cache.products = products;
            return products;
        } catch (e) {
            return [];
        }
    }


    async getPurchaseHistory() {
        // Try to get from localStorage as fallback since context might not be available here
        try {
            const savedOrders = JSON.parse(localStorage.getItem('orders') || "[]");
            const user = getUser();
            return savedOrders
                .filter(o => o.customerEmail === user?.email)
                .map(o => ({
                    product: o.productName,
                    status: o.status,
                    date: o.date
                }));
        } catch (e) {
            return [];
        }
    }

    formatForPrompt(context) {
        if (!context) return "[NO_PLATFORM_DATA_AVAILABLE]";

        return `
[PLATFORM_DATA_CONTEXT]
USER_PROFILE:
- Role: ${context.user.role}
- Goal: ${context.user.goal}
- Level: ${context.user.level}
- Wallet: ${context.user.balance} ${context.user.currency}

RECENT_RECORDS:
${context.records.length > 0 ? context.records.map(r => `- ${r.date}: Weight ${r.weight}kg, BodyFat ${r.body_fat}%`).join('\n') : "No recent weight records found."}

PURCHASE_HISTORY:
${context.orders.length > 0 ? context.orders.map(o => `- ${o.product} (${o.status}) on ${o.date}`).join('\n') : "No recent purchases."}

AVAILABLE_TRAINERS:
${context.trainers.map(t => `- ${t.name}: ${t.specialties.join(', ')} | Rate: ${t.price} GEMs | Rating: ${t.rating}`).join('\n')}

TOP_COURSES:
${context.courses.map(c => `- ${c.title} (${c.level}): ${c.price} GEMs | Rating: ${c.rating}`).join('\n')}

STORE_HIGHLIGHTS:
${context.store.map(p => `- ${p.name}: ${p.price} GEMs | Stock: ${p.stock}`).join('\n')}
`;
    }
}

export const aiContextBuilder = new AIContextBuilder();
