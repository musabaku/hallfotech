import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Page } from '../types';
import { useTheme } from '../context/ThemeContext';

type BottomNavProps = {
  currentPage: 'dashboard' | 'daily' | 'intake' | 'chat' | 'settings';
  onNavigate: (page: Page) => void;
};

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const { theme, isDark } = useTheme();
  
  const navItems = [
    { page: 'dashboard' as Page, icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { page: 'daily' as Page, icon: 'today-outline', activeIcon: 'today', label: 'Tasks' },
    { page: 'chat' as Page, icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', label: 'Mentor' },
    { page: 'settings' as Page, icon: 'settings-outline', activeIcon: 'settings', label: 'Settings' },
  ];

  return (
    <View style={[styles.container, { 
      backgroundColor: isDark ? 'rgba(30, 27, 46, 0.98)' : 'rgba(255, 255, 255, 0.95)',
      borderTopColor: isDark ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)'
    }]}>
      <View style={styles.nav}>
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <TouchableOpacity
              key={item.page}
              style={styles.navItem}
              onPress={() => onNavigate(item.page)}
            >
              <Ionicons
                name={isActive ? item.activeIcon as keyof typeof Ionicons.glyphMap : item.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={isActive ? theme.primary : theme.textSecondary}
              />
              <Text style={[styles.navLabel, { color: theme.textSecondary }, isActive && { color: theme.primary }]}>
                {item.label}
              </Text>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(147, 51, 234, 0.1)',
    paddingBottom: 20,
    paddingTop: 8,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'relative',
  },
  navLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#9333EA',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    backgroundColor: '#9333EA',
    borderRadius: 2,
  },
});
