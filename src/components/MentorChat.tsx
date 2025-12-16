import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../types';
import { useApp } from '../context';
import { chatWithAI } from '../services/aiService';
import { useTheme } from '../context/ThemeContext';

type MentorChatProps = NavigationProps;

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export const MentorChat: React.FC<MentorChatProps> = ({ onNavigate }) => {
  const { goal } = useApp();
  const { theme, isDark } = useTheme();
  const goalTitle = goal?.title || 'your learning journey';
  const goalDescription = goal?.description || '';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi there! 👋 I'm your AI mentor. I'm here to help you with ${goalTitle}! Ask me anything - tips, motivation, or guidance!`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickPrompts = [
    "Give me tips",
    "I'm feeling stuck",
    "Motivate me",
    "Suggest resources",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-8).map(m => ({
        role: m.isUser ? 'user' as const : 'assistant' as const,
        content: m.text,
      }));

      // Get AI response
      const response = await chatWithAI(text, goalTitle, goalDescription, conversationHistory);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble responding right now. Please try again! 😅",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
        <View style={[styles.header, { 
          backgroundColor: isDark ? 'rgba(30, 27, 46, 0.95)' : 'rgba(255, 255, 255, 0.9)',
          borderBottomColor: theme.border 
        }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate('dashboard')}
          >
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
              <Ionicons name="sparkles" size={20} color="white" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>AI Mentor</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Always here to help</Text>
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
              ]}
            >
              {!message.isUser && (
                <View style={[styles.aiAvatar, { backgroundColor: theme.primary }]}>
                  <Ionicons name="sparkles" size={14} color="white" />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.isUser 
                    ? [styles.userBubble, { backgroundColor: theme.primary }] 
                    : [styles.aiBubble, { backgroundColor: isDark ? theme.cardSolid : 'rgba(255, 255, 255, 0.95)' }],
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: theme.textPrimary },
                    message.isUser && styles.userMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
              <View style={[styles.aiAvatar, { backgroundColor: theme.primary }]}>
                <Ionicons name="sparkles" size={14} color="white" />
              </View>
              <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: isDark ? theme.cardSolid : 'rgba(255, 255, 255, 0.95)' }]}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={theme.primary} />
                  <Text style={[styles.typingText, { color: theme.primary }]}>Thinking...</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickPromptsContainer}
          contentContainerStyle={styles.quickPromptsContent}
        >
          {quickPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickPrompt, 
                { backgroundColor: theme.card, borderColor: theme.border },
                isLoading && styles.quickPromptDisabled
              ]}
              onPress={() => sendMessage(prompt)}
              disabled={isLoading}
            >
              <Text style={[styles.quickPromptText, { color: theme.primary }]}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { 
          backgroundColor: isDark ? 'rgba(30, 27, 46, 0.98)' : 'rgba(255, 255, 255, 0.95)',
          borderTopColor: theme.border 
        }]}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.inputBackground,
              borderColor: `${theme.primary}50`,
              color: theme.textPrimary
            }]}
            placeholder="Ask your mentor anything..."
            placeholderTextColor={theme.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage(inputText)}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient
              colors={inputText.trim() && !isLoading ? theme.cardGradient : ['#D1D5DB', '#D1D5DB']}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(147, 51, 234, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#581C87',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7C3AED',
  },
  placeholder: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#9333EA',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#581C87',
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#9333EA',
    fontStyle: 'italic',
  },
  quickPromptsContainer: {
    maxHeight: 50,
    backgroundColor: 'transparent',
  },
  quickPromptsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  quickPrompt: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
    marginRight: 8,
  },
  quickPromptDisabled: {
    opacity: 0.5,
  },
  quickPromptText: {
    fontSize: 13,
    color: '#9333EA',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(147, 51, 234, 0.2)',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#581C87',
    maxHeight: 100,
    minHeight: 50,
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  sendButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
