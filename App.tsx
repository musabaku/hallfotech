import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  LandingPage,
  Login,
  SignUp,
  GoalIntake,
  Dashboard,
  DailyTasks,
  CheckIn,
  Quiz,
  Progress,
  MentorChat,
  Settings,
  BottomNav,
} from './src/components';
import { Page } from './src/types';
import { AppProvider, ThemeProvider, useTheme } from './src/context';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [hasGoal, setHasGoal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isDark } = useTheme();

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('intake');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setCurrentPage('intake');
  };

  const handleGoToSignUp = () => {
    setCurrentPage('signup');
  };

  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  const handleGoalCreated = () => {
    setHasGoal(true);
    setCurrentPage('dashboard');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const showBottomNav =
    hasGoal &&
    currentPage !== 'landing' &&
    currentPage !== 'login' &&
    currentPage !== 'signup' &&
    currentPage !== 'checkin' &&
    currentPage !== 'quiz' &&
    currentPage !== 'progress';

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} onSignUp={handleGoToSignUp} />
      )}
      {currentPage === 'signup' && (
        <SignUp onSignUp={handleSignUp} onLogin={handleGoToLogin} />
      )}
      {currentPage === 'intake' && (
        <GoalIntake onGoalCreated={handleGoalCreated} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={navigateTo} />
      )}
      {currentPage === 'daily' && (
        <DailyTasks onNavigate={navigateTo} />
      )}
      {currentPage === 'checkin' && (
        <CheckIn onNavigate={navigateTo} />
      )}
      {currentPage === 'quiz' && (
        <Quiz onNavigate={navigateTo} />
      )}
      {currentPage === 'progress' && (
        <Progress onNavigate={navigateTo} />
      )}
      {currentPage === 'chat' && (
        <MentorChat onNavigate={navigateTo} />
      )}
      {currentPage === 'settings' && (
        <Settings onNavigate={navigateTo} />
      )}

      {showBottomNav && (
        <BottomNav
          currentPage={currentPage as 'dashboard' | 'daily' | 'intake' | 'chat' | 'settings'}
          onNavigate={navigateTo}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
