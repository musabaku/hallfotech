import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../types';
import { useApp } from '../context';
import { useTheme } from '../context/ThemeContext';

type ProgressProps = NavigationProps;

export const Progress: React.FC<ProgressProps> = ({ onNavigate }) => {
  const { goal, streak, getTodaysProgress, getOverallProgress, tasks, checkIns } = useApp();
  const { theme, isDark } = useTheme();
  
  const todaysProgress = getTodaysProgress();
  const overallProgress = getOverallProgress();
  const completedTasks = tasks.filter(t => t.completed).length;

  // Calculate real weekly data based on actual task completion
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    // Get data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];

      // Get tasks for this date
      const dayTasks = tasks.filter(task => task.date === dateString);
      const completedDayTasks = dayTasks.filter(task => task.completed).length;
      const totalDayTasks = dayTasks.length;
      
      // Calculate percentage (0 if no tasks)
      const percentage = totalDayTasks > 0 
        ? Math.round((completedDayTasks / totalDayTasks) * 100) 
        : 0;

      weekData.push({
        day: dayName,
        value: percentage,
        tasks: totalDayTasks,
        completed: completedDayTasks,
        isToday: i === 0,
      });
    }

    return weekData;
  };

  const weeklyData = getWeeklyData();

  const milestones = goal?.milestones || [];

  const stats = [
    { label: 'Day Streak', value: streak.toString(), icon: 'flame-outline', color: '#F59E0B' },
    { label: 'Tasks Done', value: completedTasks.toString(), icon: 'checkmark-circle-outline', color: '#22C55E' },
    { label: 'Quiz Score', value: '85%', icon: 'school-outline', color: '#3B82F6' },
    { label: 'Check-ins', value: checkIns.length.toString(), icon: 'heart-outline', color: '#EC4899' },
  ];

  const maxBarHeight = 120;

  return (
    <LinearGradient
      colors={theme.backgroundGradient}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate('dashboard')}
          >
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Your Progress</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Ionicons
                name={stat.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={stat.color}
              />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly Activity Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Weekly Activity</Text>
          <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>Task completion over the last 7 days</Text>
          <View style={styles.chartContainer}>
            {weeklyData.map((data, index) => (
              <View key={index} style={styles.barContainer}>
                <Text style={[styles.barValue, { color: theme.primary }]}>
                  {data.tasks > 0 ? `${data.value}%` : '-'}
                </Text>
                <View style={[styles.barWrapper, { height: maxBarHeight }]}>
                  {data.tasks > 0 ? (
                    <LinearGradient
                      colors={data.isToday ? theme.successGradient : theme.cardGradient}
                      style={[
                        styles.bar,
                        { height: Math.max((data.value / 100) * maxBarHeight, 4) },
                      ]}
                    />
                  ) : (
                    <View style={[styles.emptyBar, { height: 4, backgroundColor: isDark ? '#4A4A5A' : '#E5E7EB' }]} />
                  )}
                </View>
                <Text style={[styles.barLabel, { color: theme.textSecondary }, data.isToday && styles.barLabelToday]}>
                  {data.day}
                </Text>
                {data.isToday && <Text style={styles.todayIndicator}>Today</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Goal Progress */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Goal Progress</Text>
          <Text style={[styles.goalTitle, { color: theme.textPrimary }]}>{goal?.title || 'No goal set'}</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: `${theme.primary}30` }]}>
              <LinearGradient
                colors={theme.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${overallProgress}%` }]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.primary }]}>{overallProgress}%</Text>
          </View>
          <Text style={[styles.progressSubtext, { color: theme.textSecondary }]}>
            {goal?.targetDate ? `Target: ${goal.targetDate}` : 'Set a target date'}
          </Text>
        </View>

        {/* Milestones - only show if there are milestones */}
        {milestones.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Milestones</Text>
            {milestones.map((milestone, index) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <View style={styles.milestoneLeft}>
                  <View
                    style={[
                      styles.milestoneIcon,
                      { backgroundColor: `${theme.primary}30` },
                      milestone.completed && styles.milestoneIconCompleted,
                    ]}
                  >
                    {milestone.completed ? (
                      <Ionicons name="checkmark" size={16} color="white" />
                    ) : (
                      <Text style={[styles.milestoneNumber, { color: theme.primary }]}>{index + 1}</Text>
                    )}
                  </View>
                  {index < milestones.length - 1 && (
                    <View
                      style={[
                        styles.milestoneLine,
                        { backgroundColor: `${theme.primary}30` },
                        milestone.completed && styles.milestoneLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.milestoneContent}>
                  <Text
                    style={[
                      styles.milestoneTitle,
                      { color: theme.textPrimary },
                      milestone.completed && { textDecorationLine: 'line-through', color: theme.textMuted },
                    ]}
                  >
                    {milestone.title}
                  </Text>
                  <Text style={[styles.milestoneDate, { color: theme.textSecondary }]}>{milestone.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Encouragement */}
        <View style={styles.encouragementCard}>
          <LinearGradient
            colors={theme.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.encouragementGradient}
          >
            <Ionicons name="trophy" size={32} color="white" />
            <View style={styles.encouragementText}>
              <Text style={styles.encouragementTitle}>Keep Going!</Text>
              <Text style={styles.encouragementSubtitle}>
                You're making great progress. Stay consistent!
              </Text>
            </View>
          </LinearGradient>
        </View>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#581C87',
  },
  placeholder: {
    width: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#581C87',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581C87',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 24,
    borderRadius: 12,
  },
  emptyBar: {
    width: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  barValue: {
    fontSize: 10,
    color: '#9333EA',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  barLabel: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 4,
  },
  barLabelToday: {
    fontWeight: 'bold',
    color: '#22C55E',
  },
  todayIndicator: {
    fontSize: 9,
    color: '#22C55E',
    fontWeight: '600',
    marginTop: 2,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#7C3AED',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#581C87',
    marginBottom: 12,
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
  progressSubtext: {
    fontSize: 13,
    color: '#7C3AED',
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  milestoneLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneIconCompleted: {
    backgroundColor: '#22C55E',
  },
  milestoneNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9333EA',
  },
  milestoneLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    marginVertical: 4,
  },
  milestoneLineCompleted: {
    backgroundColor: '#22C55E',
  },
  milestoneContent: {
    flex: 1,
    paddingBottom: 16,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#581C87',
  },
  milestoneTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  milestoneDate: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 2,
  },
  encouragementCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  encouragementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  encouragementText: {
    flex: 1,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  encouragementSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
});
