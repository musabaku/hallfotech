// ============================================
// AI Service for Hall of Tech App
// Using Qwen3-32B via Huawei Competition API
// ============================================

// ⚠️ CONFIGURE THESE WHEN YOU RECEIVE THE API DETAILS FROM HUAWEI
const AI_CONFIG = {
  // Replace with the API endpoint from Huawei
  API_ENDPOINT: 'https://api-ap-southeast-1.modelarts-maas.com/v1/chat/completions',
  
  // Replace with your API key from Huawei
  API_KEY: 'CcbRY-OG3iLi569ybZAIRscxj8pkfED6MflBbYY5pZt-tx_qFIqhadVXJ_-IAFInEAb1Q7R0vn0Kso8AVWOw2A',
  // Model name - adjust if Huawei uses a different identifier
  MODEL_NAME: 'qwen3-32b',
  
  // Set to true once you have the real API configured
  USE_REAL_API: true,
};

// ============================================
// Types
// ============================================

export type GeneratedTask = {
  title: string;
  category: 'learning' | 'practice' | 'review' | 'project';
  duration: string;
};

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// ============================================
// Task Generation
// ============================================

export const generateTasksWithAI = async (
  goalTitle: string,
  goalDescription: string,
  existingMilestones: string[]
): Promise<GeneratedTask[]> => {
  const systemPrompt = `You are a helpful learning coach assistant. Generate daily tasks for learning goals. 
Always respond with ONLY a valid JSON array, no other text or markdown.`;

  const userPrompt = `Generate 5 daily learning tasks for someone working on this goal:

Goal: "${goalTitle}"
${goalDescription ? `Description: ${goalDescription}` : ''}
${existingMilestones.length > 0 ? `Milestones: ${existingMilestones.join(', ')}` : ''}

Return ONLY a JSON array with exactly this format (no markdown, no explanation):
[
  {"title": "Specific task description", "category": "learning", "duration": "30 min"},
  {"title": "Another specific task", "category": "practice", "duration": "45 min"},
  {"title": "Third task", "category": "review", "duration": "20 min"},
  {"title": "Fourth task", "category": "project", "duration": "1 hour"},
  {"title": "Fifth task", "category": "learning", "duration": "15 min"}
]

Categories: learning, practice, review, project
Durations: 15 min, 20 min, 30 min, 45 min, 1 hour

Make tasks specific and actionable for the goal.`;

  try {
    if (AI_CONFIG.USE_REAL_API) {
      return await callQwenAPI(systemPrompt, userPrompt, true);
    } else {
      return generateMockTasks(goalTitle);
    }
  } catch (error) {
    console.error('AI task generation failed:', error);
    return generateMockTasks(goalTitle);
  }
};

// ============================================
// Chat with AI Mentor
// ============================================

export const chatWithAI = async (
  userMessage: string,
  goalTitle: string,
  goalDescription: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
  const systemPrompt = `You are a friendly, encouraging AI learning mentor named "Tech Mentor" for the Hall of Tech app.

The user is working on this goal: "${goalTitle}"
${goalDescription ? `Goal description: ${goalDescription}` : ''}

Your role:
- Help them stay motivated and on track
- Answer questions about their learning journey
- Provide tips and guidance related to their goal
- Be encouraging but practical
- Keep responses concise (2-4 paragraphs max)
- Use occasional emojis to be friendly 😊

Remember: You're a mentor, not just an AI. Be warm and supportive!`;

  try {
    if (AI_CONFIG.USE_REAL_API) {
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-8).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: userMessage },
      ];
      return await callQwenAPIChat(messages);
    } else {
      return getMockChatResponse(userMessage, goalTitle);
    }
  } catch (error) {
    console.error('AI chat failed:', error);
    return getMockChatResponse(userMessage, goalTitle);
  }
};

// ============================================
// Qwen API Calls
// ============================================

const callQwenAPI = async (
  systemPrompt: string,
  userPrompt: string,
  parseAsJSON: boolean
): Promise<GeneratedTask[]> => {
  const response = await fetch(AI_CONFIG.API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '[]';

  if (parseAsJSON) {
    // Extract JSON from response (handle potential markdown wrapping)
    let jsonStr = content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    return JSON.parse(jsonStr);
  }

  return content;
};

const callQwenAPIChat = async (messages: ChatMessage[]): Promise<string> => {
  const response = await fetch(AI_CONFIG.API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.MODEL_NAME,
      messages,
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I'm having trouble responding. Please try again!";
};

// ============================================
// Mock Responses (Used until API is configured)
// ============================================

const generateMockTasks = (goalTitle: string): GeneratedTask[] => {
  const goalLower = goalTitle.toLowerCase();

  // Programming/Tech goals
  if (goalLower.includes('react') || goalLower.includes('javascript') || goalLower.includes('programming') || 
      goalLower.includes('coding') || goalLower.includes('python') || goalLower.includes('web') ||
      goalLower.includes('app') || goalLower.includes('software') || goalLower.includes('developer')) {
    return [
      { title: `Study ${goalTitle} documentation and core concepts`, category: 'learning', duration: '30 min' },
      { title: `Complete a hands-on coding exercise`, category: 'practice', duration: '45 min' },
      { title: `Build a small feature or component`, category: 'project', duration: '1 hour' },
      { title: `Review and debug yesterday's code`, category: 'review', duration: '20 min' },
      { title: `Watch a tutorial on advanced techniques`, category: 'learning', duration: '30 min' },
    ];
  }

  // Language learning
  if (goalLower.includes('language') || goalLower.includes('spanish') || goalLower.includes('french') || 
      goalLower.includes('english') || goalLower.includes('chinese') || goalLower.includes('german')) {
    return [
      { title: 'Learn 15 new vocabulary words', category: 'learning', duration: '20 min' },
      { title: 'Practice speaking/pronunciation', category: 'practice', duration: '15 min' },
      { title: 'Listen to native content (podcast/video)', category: 'learning', duration: '30 min' },
      { title: 'Write a short paragraph or dialogue', category: 'practice', duration: '25 min' },
      { title: 'Review flashcards and past vocabulary', category: 'review', duration: '15 min' },
    ];
  }

  // Fitness goals
  if (goalLower.includes('fitness') || goalLower.includes('workout') || goalLower.includes('exercise') || 
      goalLower.includes('gym') || goalLower.includes('health') || goalLower.includes('weight')) {
    return [
      { title: 'Complete warm-up routine', category: 'practice', duration: '10 min' },
      { title: 'Main workout session', category: 'practice', duration: '45 min' },
      { title: 'Learn a new exercise technique', category: 'learning', duration: '15 min' },
      { title: 'Log nutrition and hydration', category: 'review', duration: '10 min' },
      { title: 'Stretching and recovery', category: 'practice', duration: '15 min' },
    ];
  }

  // Music/Art goals
  if (goalLower.includes('music') || goalLower.includes('guitar') || goalLower.includes('piano') || 
      goalLower.includes('art') || goalLower.includes('draw') || goalLower.includes('paint')) {
    return [
      { title: 'Warm-up with scales/basic exercises', category: 'practice', duration: '15 min' },
      { title: 'Learn new piece or technique', category: 'learning', duration: '30 min' },
      { title: 'Practice challenging sections', category: 'practice', duration: '20 min' },
      { title: 'Record and review performance', category: 'review', duration: '15 min' },
      { title: 'Study theory or famous works', category: 'learning', duration: '20 min' },
    ];
  }

  // Study/Academic goals
  if (goalLower.includes('study') || goalLower.includes('exam') || goalLower.includes('course') || 
      goalLower.includes('learn') || goalLower.includes('math') || goalLower.includes('science')) {
    return [
      { title: 'Read and take notes on new material', category: 'learning', duration: '30 min' },
      { title: 'Solve practice problems', category: 'practice', duration: '45 min' },
      { title: 'Review previous notes and highlights', category: 'review', duration: '20 min' },
      { title: 'Watch educational video or lecture', category: 'learning', duration: '30 min' },
      { title: 'Create summary or mind map', category: 'project', duration: '25 min' },
    ];
  }

  // Default generic tasks
  return [
    { title: `Research ${goalTitle} fundamentals`, category: 'learning', duration: '30 min' },
    { title: `Practice core ${goalTitle} skills`, category: 'practice', duration: '45 min' },
    { title: `Review progress and take notes`, category: 'review', duration: '20 min' },
    { title: `Work on a ${goalTitle} mini-project`, category: 'project', duration: '30 min' },
    { title: `Find and study additional resources`, category: 'learning', duration: '15 min' },
  ];
};

const getMockChatResponse = (query: string, goalTitle: string): string => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return `Hey there! 👋 Great to see you working on ${goalTitle}! How can I help you today? Feel free to ask me anything about your learning journey!`;
  }

  if (lowerQuery.includes('stuck') || lowerQuery.includes('difficult') || lowerQuery.includes('hard') || lowerQuery.includes('struggling')) {
    return `I understand that ${goalTitle} can be challenging sometimes! 💪 Here are some tips:\n\n• Break the problem into smaller parts\n• Take a short break and come back fresh\n• Look for examples or tutorials\n• Try explaining the concept out loud\n\nWhat specific part are you finding difficult? I'm here to help!`;
  }

  if (lowerQuery.includes('motivat') || lowerQuery.includes('tired') || lowerQuery.includes('give up') || lowerQuery.includes('quit')) {
    return `I believe in you! 🌟 Learning ${goalTitle} is a journey, and every step forward counts.\n\nRemember:\n• You've already made progress by starting\n• Even 15 minutes of practice adds up\n• It's okay to have slow days\n\nYou're doing great just by showing up. What's one small thing you can accomplish today?`;
  }

  if (lowerQuery.includes('tip') || lowerQuery.includes('advice') || lowerQuery.includes('suggest') || lowerQuery.includes('recommend')) {
    return `Great question! 📚 Here are my top tips for mastering ${goalTitle}:\n\n1. **Be consistent** - Even 15-30 mins daily beats long irregular sessions\n2. **Learn by doing** - Apply what you learn immediately\n3. **Embrace mistakes** - They're your best teachers\n4. **Track progress** - Celebrate small wins!\n\nWhich of these would you like to explore more?`;
  }

  if (lowerQuery.includes('resource') || lowerQuery.includes('where') || lowerQuery.includes('find') || lowerQuery.includes('material')) {
    return `Looking for resources? 📖 Here's what I recommend for ${goalTitle}:\n\n• **Documentation** - Always start with official docs\n• **YouTube** - Great for visual learners\n• **Practice platforms** - Hands-on exercises\n• **Communities** - Reddit, Discord, forums\n\nWould you like more specific recommendations?`;
  }

  if (lowerQuery.includes('progress') || lowerQuery.includes('how am i') || lowerQuery.includes('doing well')) {
    return `You're making progress! 🎉 The fact that you're here, working on ${goalTitle}, shows commitment.\n\nKeep checking off those daily tasks and watch your skills grow. Remember, consistency beats intensity!\n\nWhat achievement are you most proud of so far?`;
  }

  if (lowerQuery.includes('thank')) {
    return `You're very welcome! 😊 I'm always here to help with your ${goalTitle} journey. Keep up the amazing work, and don't hesitate to reach out whenever you need guidance or motivation!`;
  }

  // Default response
  return `That's a great question about ${goalTitle}! 🤔\n\nBased on your learning journey, I'd suggest:\n• Focus on consistent daily practice\n• Build small projects to apply what you learn\n• Don't be afraid to experiment and make mistakes\n\nIs there something specific you'd like me to help you with?`;
};

// ============================================
// Export config checker for debugging
// ============================================

export const isAIConfigured = (): boolean => {
  return AI_CONFIG.USE_REAL_API && 
         AI_CONFIG.API_KEY !== 'your-api-key-here' && 
         AI_CONFIG.API_ENDPOINT !== 'https://your-huawei-api-endpoint.com/v1/chat/completions';
};
