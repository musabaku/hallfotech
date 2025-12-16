import React, { useState } from 'react';
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
import { useTheme } from '../context/ThemeContext';

type QuizProps = NavigationProps;

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export const Quiz: React.FC<QuizProps> = ({ onNavigate }) => {
  const { theme, isDark } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      question: 'What is React Native used for?',
      options: [
        'Web development only',
        'Mobile app development',
        'Desktop applications',
        'Game development',
      ],
      correctAnswer: 1,
    },
    {
      id: '2',
      question: 'Which company created React Native?',
      options: ['Google', 'Microsoft', 'Facebook (Meta)', 'Apple'],
      correctAnswer: 2,
    },
    {
      id: '3',
      question: 'What language is primarily used in React Native?',
      options: ['Python', 'JavaScript', 'Swift', 'Kotlin'],
      correctAnswer: 1,
    },
    {
      id: '4',
      question: 'What is a component in React Native?',
      options: [
        'A database',
        'A reusable piece of UI',
        'A server',
        'A testing tool',
      ],
      correctAnswer: 1,
    },
    {
      id: '5',
      question: 'What hook is used for state management in functional components?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctAnswer: 1,
    },
  ];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? styles.optionSelected : styles.option;
    }
    
    if (index === questions[currentQuestion].correctAnswer) {
      return styles.optionCorrect;
    }
    
    if (selectedAnswer === index) {
      return styles.optionWrong;
    }
    
    return styles.option;
  };

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    
    return (
      <LinearGradient
        colors={theme.backgroundGradient}
        style={styles.container}
      >
        <View style={styles.resultContainer}>
          <View style={[styles.resultCard, { backgroundColor: theme.card }]}>
            <Text style={styles.resultEmoji}>
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </Text>
            <Text style={[styles.resultTitle, { color: theme.textPrimary }]}>Quiz Complete!</Text>
            <Text style={[styles.resultScore, { color: theme.textSecondary }]}>
              You scored {score}/{questions.length}
            </Text>
            <Text style={[styles.resultPercentage, { color: theme.primary }]}>{percentage}%</Text>
            <Text style={[styles.resultMessage, { color: theme.textSecondary }]}>
              {percentage >= 80
                ? 'Excellent! You\'re mastering this topic!'
                : percentage >= 60
                ? 'Good job! Keep practicing!'
                : 'Keep learning! You\'ll get better!'}
            </Text>
          </View>
          
          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={[styles.restartButton, { backgroundColor: theme.card }]}
              onPress={handleRestart}
            >
              <Ionicons name="refresh" size={24} color={theme.primary} />
              <Text style={[styles.restartButtonText, { color: theme.primary }]}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => onNavigate('dashboard')}
            >
              <LinearGradient
                colors={theme.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.doneButtonGradient}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Quiz</Text>
          <Text style={[styles.questionCounter, { color: theme.textSecondary }]}>
            {currentQuestion + 1}/{questions.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarBg, { backgroundColor: `${theme.primary}30` }]}>
          <LinearGradient
            colors={theme.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>

        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.questionText, { color: theme.textPrimary }]}>
            {questions[currentQuestion].question}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => {
            const baseStyle = { backgroundColor: theme.card };
            const selectedStyle = showResult 
              ? (index === questions[currentQuestion].correctAnswer 
                  ? { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: '#22C55E', borderWidth: 2 }
                  : (selectedAnswer === index 
                      ? { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: '#EF4444', borderWidth: 2 }
                      : {}))
              : (selectedAnswer === index ? { borderColor: theme.primary, borderWidth: 2 } : {});
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.option, baseStyle, selectedStyle]}
                onPress={() => handleAnswer(index)}
                disabled={showResult}
              >
                <View style={[styles.optionLetter, { backgroundColor: `${theme.primary}20` }]}>
                  <Text style={[styles.optionLetterText, { color: theme.primary }]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: theme.textPrimary }]}>{option}</Text>
                {showResult && index === questions[currentQuestion].correctAnswer && (
                  <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                )}
                {showResult &&
                  selectedAnswer === index &&
                  index !== questions[currentQuestion].correctAnswer && (
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {showResult && (
          <View
            style={[
              styles.feedbackCard,
              selectedAnswer === questions[currentQuestion].correctAnswer
                ? { backgroundColor: 'rgba(34, 197, 94, 0.15)' }
                : { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
            ]}
          >
            <Ionicons
              name={
                selectedAnswer === questions[currentQuestion].correctAnswer
                  ? 'checkmark-circle'
                  : 'information-circle'
              }
              size={24}
              color={
                selectedAnswer === questions[currentQuestion].correctAnswer
                  ? '#22C55E'
                  : '#EF4444'
              }
            />
            <Text style={[styles.feedbackText, { color: theme.textPrimary }]}>
              {selectedAnswer === questions[currentQuestion].correctAnswer
                ? 'Correct! Great job!'
                : `The correct answer is: ${
                    questions[currentQuestion].options[
                      questions[currentQuestion].correctAnswer
                    ]
                  }`}
            </Text>
          </View>
        )}

        {/* Next Button */}
        {showResult && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={theme.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestion < questions.length - 1
                  ? 'Next Question'
                  : 'See Results'}
              </Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
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
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#581C87',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9333EA',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#581C87',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLetterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#581C87',
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  feedbackWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    color: '#581C87',
    lineHeight: 20,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#581C87',
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 18,
    color: '#7C3AED',
    marginBottom: 4,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 12,
  },
  resultMessage: {
    fontSize: 16,
    color: '#7C3AED',
    textAlign: 'center',
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  restartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    gap: 8,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9333EA',
  },
  doneButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
