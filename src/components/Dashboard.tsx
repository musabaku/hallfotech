import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps, Page } from '../types';
import { useApp, useTheme } from '../context';

type DashboardProps = NavigationProps;

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { 
    goal, 
    getTodaysTasks, 
    getTodaysProgress, 
    getOverallProgress,
    getMilestoneProgress,
    streak,
    toggleTask 
  } = useApp();
  const { theme } = useTheme();

  const todaysProgress = getTodaysProgress();
  const overallProgress = getOverallProgress();
  const milestoneProgress = getMilestoneProgress();
  const todaysTasks = getTodaysTasks();

  const quickActions = [
    { id: 'daily', icon: 'today-outline', label: 'Daily Tasks', page: 'daily' as Page },
    { id: 'checkin', icon: 'heart-outline', label: 'Check In', page: 'checkin' as Page },
    { id: 'quiz', icon: 'help-circle-outline', label: 'Quiz', page: 'quiz' as Page },
    { id: 'progress', icon: 'stats-chart-outline', label: 'Progress', page: 'progress' as Page },
  ];

  return (
    <LinearGradient
      colors={theme.backgroundGradient}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back! 👋</Text>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Your Dashboard</Text>
          </View>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: theme.card }]}
            onPress={() => onNavigate('settings')}
          >
            <Ionicons name="settings-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Overall Progress Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Overall Goal Progress</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
              <LinearGradient
                colors={theme.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${overallProgress}%` }]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.textPrimary }]}>{overallProgress}%</Text>
          </View>
          <Text style={[styles.goalTitle, { color: theme.textSecondary }]}>{goal?.title || 'No goal set'}</Text>
          <View style={[styles.progressDetails, { borderTopColor: theme.border }]}>
            {milestoneProgress.total > 0 && (
              <>
                <View style={styles.progressDetailItem}>
                  <Text style={[styles.progressDetailLabel, { color: theme.textMuted }]}>Milestones</Text>
                  <Text style={[styles.progressDetailValue, { color: theme.textPrimary }]}>
                    {milestoneProgress.completed}/{milestoneProgress.total}
                  </Text>
                </View>
                <View style={[styles.progressDetailDivider, { backgroundColor: theme.border }]} />
              </>
            )}
            <View style={styles.progressDetailItem}>
              <Text style={[styles.progressDetailLabel, { color: theme.textMuted }]}>Today's Tasks</Text>
              <Text style={[styles.progressDetailValue, { color: theme.textPrimary }]}>
                {todaysProgress.completed}/{todaysProgress.total}
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Progress Card */}
        <View style={[styles.todayCard, { backgroundColor: theme.card }]}>
          <View style={styles.todayHeader}>
            <Text style={[styles.todayTitle, { color: theme.textPrimary }]}>Today's Progress</Text>
            <View style={[styles.todayBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.todayBadgeText}>{todaysProgress.percentage}%</Text>
            </View>
          </View>
          <View style={[styles.todayProgressBarBg, { backgroundColor: theme.border }]}>
            <LinearGradient
              colors={todaysProgress.percentage === 100 ? theme.successGradient : theme.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.todayProgressBarFill, { width: `${todaysProgress.percentage}%` }]}
            />
          </View>
          <Text style={[styles.todaySubtext, { color: theme.textSecondary }]}>
            {todaysProgress.percentage === 100
              ? '🎉 All tasks completed! Great job!'
              : todaysProgress.percentage >= 50
              ? `💪 ${todaysProgress.total - todaysProgress.completed} tasks remaining`
              : `🚀 ${todaysProgress.total - todaysProgress.completed} tasks to go - Let's do this!`}
          </Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <LinearGradient
            colors={theme.streakGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.streakGradient}
          >
            <Ionicons name="flame" size={40} color="white" />
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{streak} Day Streak!</Text>
              <Text style={styles.streakText}>Keep it up! You're doing great!</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: theme.card }]}
              onPress={() => onNavigate(action.page)}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.border }]}>
                <Ionicons
                  name={action.icon as keyof typeof Ionicons.glyphMap}
                  size={28}
                  color={theme.primary}
                />
              </View>
              <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Focus */}
        <View style={styles.todayFocusHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Today's Focus</Text>
          <TouchableOpacity onPress={() => onNavigate('daily')}>
            <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {todaysTasks.slice(0, 3).map((task) => (
            <TouchableOpacity 
              key={task.id} 
              style={[styles.focusItem, { borderBottomColor: theme.border }]}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.7}
            >
              <View style={styles.focusCheck}>
                <Ionicons 
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={task.completed ? theme.success : theme.primary} 
                />
              </View>
              <Text style={[styles.focusText, { color: theme.textPrimary }, task.completed && styles.focusCompleted]}>
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
          {todaysTasks.length === 0 && (
            <Text style={[styles.noTasksText, { color: theme.textMuted }]}>No tasks for today!</Text>
          )}
        </View>

        {/* Chat Prompt */}
        <TouchableOpacity
          style={styles.chatPrompt}
          onPress={() => onNavigate('chat')}
        >
          <LinearGradient
            colors={theme.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chatPromptGradient}
          >
            <Ionicons name="chatbubbles" size={24} color="white" />
            <Text style={styles.chatPromptText}>
              Need help? Chat with your AI Mentor
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#7C3AED',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#581C87',
  },
  settingsButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: '#7C3AED',
    marginBottom: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#581C87',
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(147, 51, 234, 0.1)',
  },
  progressDetailItem: {
    alignItems: 'center',
  },
  progressDetailLabel: {
    fontSize: 12,
    color: '#7C3AED',
    marginBottom: 4,
  },
  progressDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#581C87',
  },
  progressDetailDivider: {
    width: 1,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  todayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581C87',
  },
  todayBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  todayProgressBarBg: {
    height: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  todayProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  todaySubtext: {
    fontSize: 13,
    color: '#7C3AED',
    textAlign: 'center',
  },
  todayFocusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#9333EA',
    fontWeight: '500',
  },
  noTasksText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 16,
  },
  streakCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  streakGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  streakInfo: {
    marginLeft: 16,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  streakText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#581C87',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#581C87',
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  focusCheck: {
    marginRight: 12,
  },
  focusText: {
    flex: 1,
    fontSize: 14,
    color: '#581C87',
  },
  focusCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  chatPrompt: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  chatPromptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  chatPromptText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});
