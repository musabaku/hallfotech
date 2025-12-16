import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context';
import { useTheme } from '../context/ThemeContext';

type GoalIntakeProps = {
  onGoalCreated: () => void;
};

export const GoalIntake: React.FC<GoalIntakeProps> = ({ onGoalCreated }) => {
  const { createGoal } = useApp();
  const { theme, isDark } = useTheme();
  
  const [step, setStep] = useState(1);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['']);
  const [milestonesEnabled, setMilestonesEnabled] = useState(true);

  const addMilestone = () => {
    setMilestones([...milestones, '']);
  };

  const updateMilestone = (index: number, value: string) => {
    const updated = [...milestones];
    updated[index] = value;
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save the goal to context
      createGoal({
        title: goalTitle || 'My Goal',
        description: goalDescription,
        targetDate: targetDate,
        milestones: milestones.filter(m => m.trim() !== ''),
        milestonesEnabled: milestonesEnabled,
      });
      onGoalCreated();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>What's your goal?</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Give your goal a clear and inspiring title
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.textPrimary
              }]}
              placeholder="e.g., Learn React Native"
              placeholderTextColor={theme.textMuted}
              value={goalTitle}
              onChangeText={setGoalTitle}
            />
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Describe your goal in detail
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.textPrimary
              }]}
              placeholder="What do you want to achieve and why?"
              placeholderTextColor={theme.textMuted}
              value={goalDescription}
              onChangeText={setGoalDescription}
              multiline
              numberOfLines={4}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>When do you want to achieve it?</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Set a target date for your goal
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.textPrimary
              }]}
              placeholder="e.g., December 31, 2025"
              placeholderTextColor={theme.textMuted}
              value={targetDate}
              onChangeText={setTargetDate}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Break it down</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
              Add milestones to track your progress
            </Text>
            
            <View style={[styles.toggleContainer, { 
              backgroundColor: theme.card,
              borderColor: theme.border 
            }]}>
              <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>Enable Milestones</Text>
              <Switch
                value={milestonesEnabled}
                onValueChange={setMilestonesEnabled}
                trackColor={{ false: isDark ? '#4A4A5A' : '#D1D5DB', true: '#C084FC' }}
                thumbColor={milestonesEnabled ? '#9333EA' : '#9CA3AF'}
              />
            </View>
            
            {milestonesEnabled && milestones.map((milestone, index) => (
              <View key={index} style={styles.milestoneRow}>
                <TextInput
                  style={[styles.input, styles.milestoneInput, { 
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }]}
                  placeholder={`Milestone ${index + 1}`}
                  placeholderTextColor={theme.textMuted}
                  value={milestone}
                  onChangeText={(value) => updateMilestone(index, value)}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMilestone(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            {milestonesEnabled && (
              <TouchableOpacity style={[styles.addButton, { backgroundColor: `${theme.primary}15` }]} onPress={addMilestone}>
                <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                <Text style={[styles.addButtonText, { color: theme.primary }]}>Add Milestone</Text>
              </TouchableOpacity>
            )}
            {!milestonesEnabled && (
              <View style={[styles.disabledMessage, { backgroundColor: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(156, 163, 175, 0.1)' }]}>
                <Ionicons name="information-circle-outline" size={20} color={theme.textMuted} />
                <Text style={[styles.disabledMessageText, { color: theme.textMuted }]}>
                  Milestones are disabled. Your progress will be tracked by daily tasks only.
                </Text>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={theme.backgroundGradient}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Create Your Goal</Text>
            <View style={styles.progressIndicator}>
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  style={[
                    styles.progressDot,
                    { backgroundColor: `${theme.primary}40` },
                    s === step && { backgroundColor: theme.primary, transform: [{ scale: 1.2 }] },
                    s < step && styles.progressDotCompleted,
                  ]}
                />
              ))}
            </View>
          </View>

          {renderStep()}

          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.card }]} onPress={prevStep}>
                <Ionicons name="arrow-back" size={24} color={theme.primary} />
                <Text style={[styles.backButtonText, { color: theme.primary }]}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
              <LinearGradient
                colors={theme.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {step === 3 ? 'Create Goal' : 'Next'}
                </Text>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#581C87',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#9333EA',
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: '#22C55E',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#581C87',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#7C3AED',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#581C87',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#9333EA',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581C87',
  },
  disabledMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  disabledMessageText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    flex: 1,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#9333EA',
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
});
