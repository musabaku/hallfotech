export type Page = 'landing' | 'login' | 'signup' | 'intake' | 'dashboard' | 'daily' | 'checkin' | 'quiz' | 'progress' | 'chat' | 'settings';

export type NavigationProps = {
  onNavigate: (page: Page) => void;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  milestones: string[];
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  category: string;
};

export type CheckInData = {
  mood: number;
  progress: number;
  notes: string;
  date: string;
};
