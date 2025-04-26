import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import Constants from 'expo-constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const DEEPSEEK_API_KEY = Constants.expoConfig?.extra?.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function fetchDeepSeekResponse(messages: Message[]): Promise<string> {
  if (!DEEPSEEK_API_KEY) return 'DeepSeek API key not set.';
  try {
    const history = messages
      .filter(m => m.sender === 'user' || m.sender === 'ai')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
    const res = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: history,
        stream: false,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('DeepSeek API HTTP error:', res.status, text);
      return `DeepSeek error: ${res.status} - ${text}`;
    }
    const data = await res.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('DeepSeek API malformed response:', data);
      return 'No valid response from DeepSeek.';
    }
    return data.choices[0].message.content;
  } catch (err: any) {
    console.error('Error connecting to DeepSeek:', err);
    return 'Error connecting to DeepSeek.';
  }
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const aiText = await fetchDeepSeekResponse([...messages, userMsg]);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), text: aiText, sender: 'ai' };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'AI Chat', headerLargeTitle: true }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}> 
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
          style={{ flex: 1 }}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything..."
            placeholderTextColor="#bdbdbd"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} accessibilityLabel="Send message">
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191b23',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0ea5e9',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#232323',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#232323',
    backgroundColor: '#232323',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#191b23',
    borderRadius: 12,
    color: '#fff',
    paddingHorizontal: 14,
    fontSize: 16,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
