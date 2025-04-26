import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FocusScreen() {
  const [focusMinutes, setFocusMinutes] = useState<string>('0');
  const [breakMinutes, setBreakMinutes] = useState<string>('0');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Apply custom durations and reset timer (validate input)
  function applySettings() {
    const focus = parseInt(focusMinutes, 10);
    const brk = parseInt(breakMinutes, 10);
    const validFocus = !isNaN(focus) && focus > 0 ? focus : 60;
    const validBreak = !isNaN(brk) && brk > 0 ? brk : 10;
    setTimeLeft(validFocus * 60);
    setFocusMinutes(validFocus.toString());
    setBreakMinutes(validBreak.toString());
    setIsBreak(false);
    setIsActive(false);
    setShowSettings(false);
  }

  // Clear session (reset everything, show 00:00)
  function clearSession() {
    setFocusMinutes('60');
    setBreakMinutes('10');
    setTimeLeft(0); // Show 00:00
    setIsActive(false);
    setIsBreak(false);
    setShowSettings(false);
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const focusVal = parseInt(focusMinutes, 10);
    const breakVal = parseInt(breakMinutes, 10);
    const validFocus = !isNaN(focusVal) && focusVal > 0 ? focusVal : 60;
    const validBreak = !isNaN(breakVal) && breakVal > 0 ? breakVal : 10;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Switch between focus and break
      if (!isBreak) {
        setTimeLeft(validBreak * 60);
        setIsBreak(true);
      } else {
        setTimeLeft(validFocus * 60);
        setIsBreak(false);
      }
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, focusMinutes, breakMinutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    const focusVal = parseInt(focusMinutes, 10);
    const breakVal = parseInt(breakMinutes, 10);
    const validFocus = !isNaN(focusVal) && focusVal > 0 ? focusVal : 0;
    const validBreak = !isNaN(breakVal) && breakVal > 0 ? breakVal : 0;
    setTimeLeft(isBreak ? validBreak * 60 : validFocus * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Focus Mode',
          headerStyle: {
            backgroundColor: '#4f46e5', // Indigo-600
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.main}>
        {showSettings ? (
          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>Customize Session</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Focus (min):</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={focusMinutes}
                onChangeText={setFocusMinutes}
                maxLength={3}
                accessibilityLabel="Set focus minutes"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Break (min):</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={breakMinutes}
                onChangeText={setBreakMinutes}
                maxLength={3}
                accessibilityLabel="Set break minutes"
              />
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={applySettings}
                accessibilityLabel="Apply custom timer settings"
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setShowSettings(false)}
                accessibilityLabel="Cancel custom timer settings"
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{timeLeft > 0 ? formatTime(timeLeft) : '00:00'}</Text>
              <Text style={styles.modeText}>{isBreak ? 'Break Time' : 'Focus Time'}</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={toggleTimer}
                accessibilityLabel={isActive ? 'Pause timer' : 'Start timer'}
              >
                <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={resetTimer}
                accessibilityLabel="Reset timer"
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Reset</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setShowSettings(true)}
                accessibilityLabel="Customize focus and break times"
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Customize</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={clearSession}
                accessibilityLabel="Clear session"
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#200b0b',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 150,
    fontWeight: 'bold',
    color: '#00fff9', // Indigo-600
    fontVariant: ['tabular-nums'],
  },
  modeText: {
    fontSize: 30,
    color: '#71717a', // Zinc-500
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    width: 140,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#10b981', // Emerald-500
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4f46e5', // Indigo-600
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#4f46e5', // Indigo-600
  },
  exitButton: {
    marginLeft: 16,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 16,
    color: '#374151',
    marginRight: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    width: 80,
    backgroundColor: '#f9fafb',
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
});
