import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../types';
import { useApp, useTheme } from '../context';

type SettingsProps = NavigationProps;

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const { goal, resetGoal } = useApp();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => {
          resetGoal();
          onNavigate('landing');
        }},
      ]
    );
  };

  const handleResetGoal = () => {
    Alert.alert(
      'Reset Goal',
      'This will delete your current goal and progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {
          resetGoal();
          onNavigate('intake');
        }},
      ]
    );
  };

  const SettingRow = ({
    icon,
    title,
    subtitle,
    hasSwitch,
    switchValue,
    onSwitchChange,
    onPress,
    isDestructive,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={[styles.settingIcon, { backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.1)' : `${theme.primary}15` }]}>
        <Ionicons
          name={icon}
          size={22}
          color={isDestructive ? '#EF4444' : theme.primary}
        />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.textPrimary }, isDestructive && styles.settingTitleDestructive]}>
          {title}
        </Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
      {hasSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: isDark ? '#4A4A5A' : '#D1D5DB', true: '#C084FC' }}
          thumbColor={switchValue ? '#9333EA' : isDark ? '#888' : '#F3F4F6'}
        />
      )}
      {!hasSwitch && (
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      )}
    </TouchableOpacity>
  );

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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Section */}
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.textPrimary }]}>John Doe</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil-outline" size={20} color="#9333EA" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Notifications</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <SettingRow
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Enable all notifications"
            hasSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="alarm-outline"
            title="Daily Reminders"
            subtitle="Remind me to complete tasks"
            hasSwitch
            switchValue={dailyReminders}
            onSwitchChange={setDailyReminders}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="bar-chart-outline"
            title="Weekly Report"
            subtitle="Send weekly progress summary"
            hasSwitch
            switchValue={weeklyReport}
            onSwitchChange={setWeeklyReport}
          />
        </View>

        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <SettingRow
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            hasSwitch
            switchValue={isDark}
            onSwitchChange={toggleTheme}
          />
        </View>

        {/* Goal Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Goal Management</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <SettingRow
            icon="flag-outline"
            title="Current Goal"
            subtitle={goal?.title || 'No goal set'}
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="create-outline"
            title="Edit Goal"
            subtitle="Modify your current goal"
            onPress={() => {
              resetGoal();
              onNavigate('intake');
            }}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="refresh-outline"
            title="Reset Goal"
            subtitle="Start fresh with a new goal"
            onPress={handleResetGoal}
            isDestructive
          />
        </View>

        {/* Support Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Support</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <SettingRow
            icon="help-circle-outline"
            title="Help & FAQ"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="chatbubble-outline"
            title="Contact Support"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <SettingRow
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <SettingRow
            icon="log-out-outline"
            title="Log Out"
            onPress={handleLogout}
            isDestructive
          />
        </View>

        {/* Version */}
        <Text style={[styles.version, { color: theme.textMuted }]}>Hall of Tech v1.0.0</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#581C87',
  },
  profileEmail: {
    fontSize: 14,
    color: '#7C3AED',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingIconDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#581C87',
  },
  settingTitleDestructive: {
    color: '#EF4444',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#7C3AED',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    marginLeft: 68,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
