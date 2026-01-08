import OpenAI from 'openai';

// 1. Configuration
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// 2. GYMGEM Context - The "Brain" of the Chatbot
const SITE_STRUCTURE = `
- Home: /home
- Courses: /courses
- All Trainers: /trainers
- All Trainees: /trainees
- Community: /community
- Our Stores: /stores
- Cart: /cart
- About Us: /about
- Contact/Support: /contact
- Privacy Policy: /privacy
- Terms of Service: /terms
- Your Profile: /profile
- Settings: /settings
- AI Services:
  - AI Personal Trainer: /ai-trainer
  - AI Food Analyzer: /ai-food
  - AI Chatbot: /ai-chat
  - Workout History: /workout-history
  - Food History: /food-history
- Dashboards:
  - Trainee: /trainee/dashboard (My Courses: /trainee/courses, Favorites: /trainee/favorite, Calendar: /trainee/calendar)
  - Trainer: /trainer/dashboard (My Clients: /trainer/clients, My Courses: /trainer/courses, Add Course: /trainer/addcourse)
  - Gym: /gym/dashboard
  - Store: /store/dashboard
- Authentication: /login, /signup
`;

const GYMGEM_CONTEXT = `You are the GYMGEM AI Assistant, a core part of the GYMGEM fitness platform.

PLATFORM CONTEXT:
GYMGEM is an all-in-one fitness ecosystem offering:
- Professional courses for trainees.
- AI-powered workout and food analysis.
- A marketplace (Store) for fitness gear and supplements.
- Direct interaction with certified trainers.

SITE NAVIGATION (INTERNAL LINKS):
Use these EXACT paths when guiding users:
${SITE_STRUCTURE}

VOICE & TONE:
- Name: GYMGEM AI
- Tone: Motivational, Professional, Energetic, and Helpful.
- Constraints: NEVER recommend external apps or gyms. ALWAYS direct users to GYMGEM features.
- If you don't know something, strictly say: "I can only answer questions related to GYMGEM and fitness."

**GYMGEM CORE FEATURES (Your Help Guide):**

1. **AI Personal Trainer**:
   - *What:* Real-time workout assistant using the camera.
   - *How:* It uses pose detection to count reps and correct your form.
   - *Link*: [/ai-trainer](/ai-trainer)
   - *How to help*: Explain how to position the camera and select exercises.

2. **AI Food Analyzer**:
   - *What:* Nutrition tracker using image recognition.
   - *How*: Snap or upload a photo of your meal -> Get calories and macros (Protein, Carbs, Fats).
   - *Link*: [/ai-food](/ai-food)
   - *How to help*: Guide users on how to track their daily calories.

3. **Gems & Rewards**:
   - *What:* Our virtual currency.
   - *How*: Earn Gems by working out, completing courses, or buying them in the dashboard.
   - *Usage*: Use Gems to unlock premium courses or buy gear in the Store.

4. **Courses & Training**:
   - *What*: Professional programs led by international trainers.
   - *How to help*: Suggest matching courses based on user goals (e.g., Weight Loss, Muscle Gain).

5. **Community**:
   - *What*: Social wall where users share progress.
   - *Link*: [/community](/community)

**PERSONALIZATION & DATA-DRIVEN RECOMMENDATIONS:**
You will be provided with:
1. \`[USER_CONTEXT]\`: Current UI state, role (Trainee/Trainer/Gym/Store), and basic info.
2. \`[PLATFORM_DATA_CONTEXT]\`: Real-time data including:
   - Recent records (Weight, etc.) - HIGHEST PRIORITY signals.
   - Available Trainers, Top Courses, and Store Products.
   - User Financial Context (Wallet Balance).

**RECOMMENDATION & HELP LOGIC:**
1. **Analyze Signals**: If you see weights/stats in recent records, use them to motivate or adjust your advice.
2. **Trainer Matching**: Match trainers to User Goals using their specialties.
3. **Product/Course Fit**: Suggest items that fit the user's level and category interest.
4. **Financial Constraint**: NEVER recommend an item and suggest buying it if it costs more than the User's current Wallet Balance. Instead, suggest they buy Gems first.
5. **Role-Based Support**: 
   - If User is a **Trainer**, help them manage courses or clients ([/trainer/dashboard](/trainer/dashboard)).
   - If User is a **Store**, help them manage inventory ([/store/dashboard](/store/dashboard)).
   - If User is a **Trainee**, guide them to workouts and tracking.

**OUTPUT RULES:**
- Provide direct recommendations (Trainer / Course / Product) or clear navigation steps.
- Give a short, data-backed explanation for your help.
- Response Language: **STRICTLY** match the user's language (English or Arabic).
- Always include a "Call to Action" with an internal link.
`;



// 3. Dynamic Model Initialization
let openai = null;

const initializeChat = () => {
    if (!API_KEY) {
        console.warn("⚠️ VITE_OPENAI_API_KEY is missing. Chatbot will not work.");
        return null;
    }

    if (!openai) {
        openai = new OpenAI({
            apiKey: API_KEY,
            dangerouslyAllowBrowser: true // Required for client-side usage
        });
    }

    return openai;
};

// 4. Service Methods
export const aiChatService = {
  
  // Start or Reset a Chat Session (Mock capability since OpenAI is stateless REST)
  startChat: async (history = []) => {
    // OpenAI is stateless, so we mainly check initialization here
    try {
        const instance = initializeChat();
        if (!instance) {
             console.error("Failed to initialize OpenAI instance.");
             return null;
        }
        return instance;
    } catch (e) {
        console.error("Failed to initialize OpenAI:", e);
        return null;
    }
  },

  // Send a Message
  sendMessage: async (message, uiContext = null, platformContext = null, history = []) => {
    if (!API_KEY) {
        console.error("API Key missing during sendMessage call");
        return "System Error: OpenAI API Key is missing. Please check your configuration.";
    }
    
    // Ensure initialization
    if (!openai) {
        initializeChat();
    }

    if (!openai) {
         return "Service Unavailable: I'm having trouble connecting to the AI service. Please refresh and try again.";
    }

    try {
      // 1. Prepare Messages
      const fullContext = [uiContext, platformContext].filter(Boolean).join('\n\n');
      const messages = [
          { role: "system", content: GYMGEM_CONTEXT },
          // Convert history format
          ...history.map(msg => ({
              role: msg.role === 'model' ? 'assistant' : msg.role, 
              content: msg.content
          })),
          // Add current message with context
          { 
              role: "user", 
              content: fullContext ? `${fullContext}\n\n[USER_MESSAGE]: ${message}` : message 
          }
      ];


      // 2. Call OpenAI API
      const completion = await openai.chat.completions.create({
          messages: messages,
          model: "gpt-4o", // Or gpt-3.5-turbo if preferred for cost
          max_tokens: 500,
          temperature: 0.7,
      });

      if (!completion.choices || completion.choices.length === 0) {
          throw new Error("No response received from AI service.");
      }

      return completion.choices[0].message.content;

    } catch (error) {
      console.error("Detail Chat Error:", error);
      
      // Handle specfic OpenAI errors if needed, or generic
      if (error.status === 401) {
          return "Authentication Error: The API Key seems to be invalid. Please check your settings.";
      } else if (error.status === 429) {
          return "Rate Limit Exceeded: I'm receiving too many requests right now. Please try again in a moment.";
      } else if (error.status >= 500) {
          return "Server Error: OpenAI is currently experiencing issues. Please try again later.";
      }

      return "I'm having trouble connecting to the gym network right now. Please try again later! 💪";
    }
  }
};

