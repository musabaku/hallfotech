import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type LandingPageProps = {
  onGetStarted: () => void;
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { theme, isDark } = useTheme();
  
  return (
    <LinearGradient
      colors={theme.backgroundGradient}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
          <Ionicons name="rocket-outline" size={80} color={theme.primary} />
        </View>
        
        <Text style={[styles.title, { color: theme.textPrimary }]}>Hall of Tech</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Your personal AI mentor to help you achieve your goals
        </Text>

        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="checkmark-circle-outline"
            title="Set Goals"
            description="Define your objectives and track progress"
            theme={theme}
            isDark={isDark}
          />
          <FeatureItem
            icon="calendar-outline"
            title="Daily Tasks"
            description="Stay on track with personalized daily activities"
            theme={theme}
            isDark={isDark}
          />
          <FeatureItem
            icon="chatbubbles-outline"
            title="AI Mentor"
            description="Get guidance and support whenever you need"
            theme={theme}
            isDark={isDark}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onGetStarted}>
          <LinearGradient
            colors={theme.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

type FeatureItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  theme: any;
  isDark: boolean;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, theme, isDark }) => (
  <View style={[styles.featureItem, { backgroundColor: isDark ? 'rgba(45, 38, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
    <View style={[styles.featureIcon, { backgroundColor: `${theme.primary}15` }]}>
      <Ionicons name={icon} size={28} color={theme.primary} />
    </View>
    <View style={styles.featureText}>
      <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>{description}</Text>
    </View>
  </View>
);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#581C87',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581C87',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7C3AED',
  },
  button: {
    width: width - 48,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
});
