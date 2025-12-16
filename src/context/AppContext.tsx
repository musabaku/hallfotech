import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { generateTasksWithAI, GeneratedTask } from '../services/aiService';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  category: 'learning' | 'practice' | 'review' | 'project';
  duration: string;
  date: string; // ISO date string
};

export type CheckInData = {
  mood: number;
  progress: number;
  notes: string;
  date: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  milestones: { id: string; title: string; completed: boolean; date: string }[];
  createdAt: string;
};

// Track which days had completed tasks
export type CompletionHistory = {
  [date: string]: boolean; // date -> whether any task was completed
};

type CreateGoalParams = {
  title: string;
  description: string;
  targetDate: string;
  milestones: string[];
  milestonesEnabled: boolean;
};

type AppContextType = {
  // Goal
  goal: Goal | null;
  setGoal: (goal: Goal) => void;
  createGoal: (params: CreateGoalParams) => void;
  resetGoal: () => void;
  toggleMilestone: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  toggleTask: (id: string) => void;
  getTodaysTasks: () => Task[];
  getTodaysProgress: () => { completed: number; total: number; percentage: number };
  generateTasksForGoal: (goalTitle: string) => void;
  
  // Check-ins
  checkIns: CheckInData[];
  addCheckIn: (checkIn: CheckInData) => void;
  
  // Streak
  streak: number;
  completionHistory: CompletionHistory;
  
  // Overall progress
  getOverallProgress: () => number;
  getMilestoneProgress: () => { completed: number; total: number; percentage: number };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const today = getTodayDateString();
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const createGoal = (params: CreateGoalParams) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: params.title,
      description: params.description,
      targetDate: params.targetDate,
      milestones: params.milestonesEnabled
        ? params.milestones
            .filter(m => m.trim() !== '')
            .map((title, index) => ({
              id: (index + 1).toString(),
              title,
              completed: false,
              date: params.targetDate,
            }))
        : [],
      createdAt: today,
    };
    setGoal(newGoal);
    // Generate AI-powered tasks based on goal details
    generateTasksForGoal(params.title, params.description, params.milestones);
  };

  const resetGoal = () => {
    setGoal(null);
    setTasks([]);
  };

  const toggleMilestone = (id: string) => {
    if (!goal) return;
    setGoal({
      ...goal,
      milestones: goal.milestones.map(m =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    });
  };

  const generateTasksForGoal = async (goalTitle: string, goalDescription: string = '', milestones: string[] = []) => {
    try {
      // Generate tasks using AI service (uses smart fallback if API not configured)
      const generatedTasks = await generateTasksWithAI(goalTitle, goalDescription, milestones);
      
      const newTasks: Task[] = generatedTasks.map((task: GeneratedTask, index: number) => ({
        id: (index + 1).toString(),
        title: task.title,
        completed: false,
        category: task.category,
        duration: task.duration,
        date: today,
      }));
      
      setTasks(newTasks);
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      // Fallback to basic tasks if everything fails
      const fallbackTasks: Task[] = [
        { id: '1', title: `Research ${goalTitle} basics`, completed: false, category: 'learning', duration: '30 min', date: today },
        { id: '2', title: `Practice ${goalTitle} fundamentals`, completed: false, category: 'practice', duration: '45 min', date: today },
        { id: '3', title: `Review ${goalTitle} concepts`, completed: false, category: 'review', duration: '20 min', date: today },
        { id: '4', title: `Apply ${goalTitle} in a project`, completed: false, category: 'project', duration: '30 min', date: today },
        { id: '5', title: `Find resources about ${goalTitle}`, completed: false, category: 'learning', duration: '15 min', date: today },
      ];
      setTasks(fallbackTasks);
    }
  };

  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [completionHistory, setCompletionHistory] = useState<CompletionHistory>({});
  const [streak, setStreak] = useState(0);

  // Calculate streak based on completion history
  const calculateStreak = (history: CompletionHistory): number => {
    let currentStreak = 0;
    const today = new Date();
    
    // Start from today and go backwards
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      if (history[dateString]) {
        currentStreak++;
      } else if (i > 0) {
        // If it's not today and there's a gap, break the streak
        break;
      }
      // If it's today and no completion yet, continue checking yesterday
    }
    
    return currentStreak;
  };

  // Update completion history when tasks change
  useEffect(() => {
    const todaysTasks = tasks.filter(task => task.date === today);
    const hasCompletedTask = todaysTasks.some(task => task.completed);
    
    if (hasCompletedTask !== completionHistory[today]) {
      const newHistory = { ...completionHistory, [today]: hasCompletedTask };
      setCompletionHistory(newHistory);
      setStreak(calculateStreak(newHistory));
    }
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTodaysTasks = () => {
    return tasks.filter(task => task.date === today);
  };

  const getTodaysProgress = () => {
    const todaysTasks = getTodaysTasks();
    const completed = todaysTasks.filter(t => t.completed).length;
    const total = todaysTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const addCheckIn = (checkIn: CheckInData) => {
    setCheckIns(prev => [...prev, checkIn]);
  };

  const getMilestoneProgress = () => {
    if (!goal) return { completed: 0, total: 0, percentage: 0 };
    const completed = goal.milestones.filter(m => m.completed).length;
    const total = goal.milestones.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getOverallProgress = () => {
    // Calculate overall progress based on:
    // 1. Milestone completion (60% weight)
    // 2. Today's task completion (40% weight)
    const milestoneProgress = getMilestoneProgress().percentage;
    const todaysProgress = getTodaysProgress().percentage;
    
    const overall = Math.round((milestoneProgress * 0.6) + (todaysProgress * 0.4));
    return overall;
  };

  return (
    <AppContext.Provider
      value={{
        goal,
        setGoal,
        createGoal,
        resetGoal,
        toggleMilestone,
        tasks,
        setTasks,
        toggleTask,
        getTodaysTasks,
        getTodaysProgress,
        generateTasksForGoal,
        checkIns,
        addCheckIn,
        streak,
        completionHistory,
        getOverallProgress,
        getMilestoneProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
