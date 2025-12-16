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
import { NavigationProps } from '../types';
import { useApp, Task } from '../context';
import { useTheme } from '../context/ThemeContext';

type DailyTasksProps = NavigationProps;

export const DailyTasks: React.FC<DailyTasksProps> = ({ onNavigate }) => {
  const { getTodaysTasks, getTodaysProgress, toggleTask } = useApp();
  const { theme } = useTheme();
  
  const tasks = getTodaysTasks();
  const { completed: completedCount, total: totalCount, percentage: progress } = getTodaysProgress();

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'learning':
        return '#3B82F6';
      case 'practice':
        return '#10B981';
      case 'review':
        return '#F59E0B';
      default:
        return '#9333EA';
    }
  };

  const getCategoryIcon = (category: Task['category']): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case 'learning':
        return 'book-outline';
      case 'practice':
        return 'code-slash-outline';
      case 'review':
        return 'refresh-outline';
      default:
        return 'checkbox-outline';
    }
  };

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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Daily Tasks</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>Today's Progress</Text>
            <Text style={[styles.summaryCount, { color: theme.primary }]}>{completedCount}/{totalCount}</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: `${theme.primary}30` }]}>
            <LinearGradient
              colors={theme.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={[styles.encouragement, { color: theme.textSecondary }]}>
            {progress === 100
              ? '🎉 Amazing! All tasks completed!'
              : progress >= 50
              ? '💪 Great progress! Keep going!'
              : '🚀 Let\'s get started!'}
          </Text>
        </View>

        {/* Category Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Learning</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Practice</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Review</Text>
          </View>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksContainer}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                { backgroundColor: theme.card },
                task.completed && styles.taskCardCompleted,
              ]}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.7}
            >
              <View style={styles.taskLeft}>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: theme.primary },
                    task.completed && styles.checkboxChecked,
                  ]}
                >
                  {task.completed && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <View style={styles.taskInfo}>
                  <Text
                    style={[
                      styles.taskTitle,
                      { color: theme.textPrimary },
                      task.completed && { textDecorationLine: 'line-through', color: theme.textMuted },
                    ]}
                  >
                    {task.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: `${getCategoryColor(task.category)}20` },
                      ]}
                    >
                      <Ionicons
                        name={getCategoryIcon(task.category)}
                        size={12}
                        color={getCategoryColor(task.category)}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          { color: getCategoryColor(task.category) },
                        ]}
                      >
                        {task.category}
                      </Text>
                    </View>
                    <View style={[styles.durationBadge, { backgroundColor: `${theme.primary}20` }]}>
                      <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
                      <Text style={[styles.durationText, { color: theme.textSecondary }]}>{task.duration}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 100,
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
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581C87',
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  encouragement: {
    fontSize: 14,
    color: '#7C3AED',
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#7C3AED',
  },
  tasksContainer: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#581C87',
    marginBottom: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    color: '#7C3AED',
  },
});
