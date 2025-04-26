import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Pressable, useWindowDimensions } from 'react-native';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function Home() {
  const { width } = useWindowDimensions();
  // Responsive paddings and font sizes
  const isLargeScreen = width > 700;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'DhyanSe Make you life easier',
          headerLargeTitle: true,
        }}
      />
      <View style={[styles.main, isLargeScreen && { paddingHorizontal: width * 0.15 }]}> 
        <View style={styles.header}>
          <Text style={[styles.title, isLargeScreen && { fontSize: 56 }]}>Welcome to DhyanSe App</Text>
          <Text style={[styles.subtitle, isLargeScreen && { fontSize: 30 }]}>Apka apna productivity app </Text>
        </View>

        <View style={styles.quickActions}>
          <ActionButton label="Tasks" onPress={() => router.push('/tasks')} style={[styles.gridButton, { marginBottom: 22 }]} />
          <ActionButton label="Focus" onPress={() => router.push('/focus')} style={[styles.gridButton, styles.focusModeButton, { marginBottom: 22 }]} />
          <ActionButton label="Notes" onPress={() => router.push('/notes')} style={[styles.gridButton, styles.notesButton, { marginBottom: 22 }]} />
          <ActionButton label="AI Chat" onPress={() => router.push('/ai-chat')} style={[styles.gridButton, styles.aiChatButton]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Platform-aware, accessible action button
interface ActionButtonProps {
  label: string;
  onPress: () => void;
  style?: any;
}

function ActionButton({ label, onPress, style }: ActionButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={onPress}
        // @ts-ignore: web-only props
        {...({
          tabIndex: 0,
          'aria-label': label,
          role: 'button',
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') onPress();
          },
        } as any)}
        style={({ pressed }) => [
          styles.actionButton,
          style,
          (pressed || isHovered) && { opacity: 0.8, outlineWidth: 2, outlineColor: '#0ea5e9', outlineStyle: 'solid' },
        ]}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Text style={styles.actionButtonText}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionButton, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.8}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11001c', // Zinc-50
  },
  main: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 41,
    fontWeight: 'bold',
    color: '#ff9e00', // Indigo-600
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 23,
    color: '#71717a', // Zinc-500
  },
  quickActions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#220135', // Indigo-600
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    elevation: 2,
  },
  gridButton: {
    width: '90%',
    height: 80,
    marginVertical: 4,
    alignSelf: 'center',
  },
  focusModeButton: {
    backgroundColor: '#32004f', // Emerald-500
  },
  notesButton: {
    backgroundColor: '#064e3b', // Emerald-700
  },
  aiChatButton: {
    backgroundColor: '#0ea5e9', // Sky-500
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
