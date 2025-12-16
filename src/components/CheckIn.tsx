import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../types';
import { useTheme } from '../context/ThemeContext';

type CheckInProps = NavigationProps;

export const CheckIn: React.FC<CheckInProps> = ({ onNavigate }) => {
  const [mood, setMood] = useState<number>(3);
  const [progress, setProgress] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const { theme, isDark } = useTheme();

  const moods = [
    { value: 1, emoji: '😔', label: 'Struggling' },
    { value: 2, emoji: '😕', label: 'Okay' },
    { value: 3, emoji: '😊', label: 'Good' },
    { value: 4, emoji: '😄', label: 'Great' },
    { value: 5, emoji: '🤩', label: 'Amazing' },
  ];

  const progressLevels = [
    { value: 1, label: 'Minimal', color: '#EF4444' },
    { value: 2, label: 'Some', color: '#F59E0B' },
    { value: 3, label: 'Moderate', color: '#EAB308' },
    { value: 4, label: 'Good', color: '#22C55E' },
    { value: 5, label: 'Excellent', color: '#10B981' },
  ];

  const handleSubmit = () => {
    // Save check-in data
    console.log({ mood, progress, notes });
    onNavigate('dashboard');
  };

  return (
    <LinearGradient
      colors={theme.backgroundGradient}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => onNavigate('dashboard')}
          >
            <Ionicons name="close" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Daily Check-In</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        {/* Mood Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>How are you feeling today?</Text>
          <View style={styles.moodContainer}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[
                  styles.moodButton,
                  { backgroundColor: isDark ? 'rgba(45, 38, 64, 0.7)' : 'rgba(255, 255, 255, 0.5)' },
                  mood === m.value && { backgroundColor: `${theme.primary}30`, borderWidth: 2, borderColor: theme.primary },
                ]}
                onPress={() => setMood(m.value)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    { color: theme.textSecondary },
                    mood === m.value && { fontWeight: '600', color: theme.primary },
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            How much progress did you make today?
          </Text>
          <View style={styles.progressContainer}>
            {progressLevels.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.progressButton,
                  { backgroundColor: isDark ? 'rgba(45, 38, 64, 0.7)' : 'rgba(255, 255, 255, 0.7)' },
                  progress === p.value && {
                    backgroundColor: p.color,
                    borderColor: p.color,
                  },
                ]}
                onPress={() => setProgress(p.value)}
              >
                <Text
                  style={[
                    styles.progressLabel,
                    { color: theme.textPrimary },
                    progress === p.value && styles.progressLabelActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Any reflections to share?</Text>
          <TextInput
            style={[styles.notesInput, { 
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.textPrimary 
            }]}
            placeholder="What went well? What could be improved?"
            placeholderTextColor={theme.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Tips */}
        <View style={[styles.tipCard, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)' }]}>
          <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
          <Text style={[styles.tipText, { color: isDark ? '#FCD34D' : '#92400E' }]}>
            Regular check-ins help you stay aware of your progress and identify
            patterns in your learning journey.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={theme.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Submit Check-In</Text>
            <Ionicons name="checkmark-circle" size={24} color="white" />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  closeButton: {
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
  date: {
    fontSize: 14,
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581C87',
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '18%',
  },
  moodButtonActive: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    color: '#7C3AED',
    textAlign: 'center',
  },
  moodLabelActive: {
    fontWeight: '600',
    color: '#9333EA',
  },
  progressContainer: {
    gap: 8,
  },
  progressButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  progressLabel: {
    fontSize: 14,
    color: '#581C87',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressLabelActive: {
    color: 'white',
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#581C87',
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
