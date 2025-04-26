import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

interface Note {
  id: string;
  text: string;
  color: string;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [noteColor, setNoteColor] = useState('#00fff9');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('focusflow_notes').then(val => {
      if (val) setNotes(JSON.parse(val));
    });
  }, []);

  function saveNotes(notesArr: Note[]) {
    setNotes(notesArr);
    AsyncStorage.setItem('focusflow_notes', JSON.stringify(notesArr));
  }

  function handleSaveNote() {
    if (!noteInput.trim()) return;
    if (editingNote) {
      const updated = notes.map(n => n.id === editingNote.id ? { ...n, text: noteInput, color: noteColor } : n);
      saveNotes(updated);
    } else {
      saveNotes([
        ...notes,
        { id: Date.now().toString(), text: noteInput, color: noteColor },
      ]);
    }
    setShowModal(false);
    setNoteInput('');
    setNoteColor('#00fff9');
    setEditingNote(null);
  }
  function handleEditNote(note: Note) {
    setEditingNote(note);
    setNoteInput(note.text);
    setNoteColor(note.color);
    setShowModal(true);
  }
  function handleDeleteNote(id: string) {
    saveNotes(notes.filter(n => n.id !== id));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Notes', headerLargeTitle: true }} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity style={styles.addNoteFab} onPress={() => { setEditingNote(null); setNoteInput(''); setNoteColor('#00fff9'); setShowModal(true); }} accessibilityLabel="Add note">
          <Text style={{ fontSize: 28, color: '#1a1a1a', fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteCard, { borderLeftColor: item.color }]}> 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.noteText}>{item.text}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleEditNote(item)} accessibilityLabel="Edit note">
                  <Text style={styles.noteAction}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNote(item.id)} accessibilityLabel="Delete note">
                  <Text style={styles.noteAction}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.notesEmpty}>No notes yet. Tap + to add one!</Text>}
        style={{ marginTop: 10 }}
      />
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingNote ? 'Edit Note' : 'Add Note'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type your note..."
              placeholderTextColor="#bdbdbd"
              multiline
              value={noteInput}
              onChangeText={setNoteInput}
            />
            <View style={styles.colorRow}>
              {['#00fff9', '#ff9e00', '#ef4444', '#10b981', '#6366f1'].map(color => (
                <Pressable
                  key={color}
                  style={[styles.colorCircle, { backgroundColor: color, borderWidth: noteColor === color ? 3 : 1, borderColor: noteColor === color ? '#fff' : '#333' }]}
                  onPress={() => setNoteColor(color)}
                  accessibilityLabel={`Set note color ${color}`}
                />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalCancelBtn}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNote} style={styles.modalSaveBtn}><Text style={styles.modalSaveText}>{editingNote ? 'Update' : 'Save'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#200b0b',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginHorizontal: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00fff9',
  },
  addNoteFab: {
    backgroundColor: '#00fff9',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  noteCard: {
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 18,
    marginBottom: 10,
    borderLeftWidth: 6,
  },
  noteText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  noteAction: {
    fontSize: 18,
    color: '#ff9e00',
    marginLeft: 8,
  },
  notesEmpty: {
    color: '#bdbdbd',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#232323',
    borderRadius: 14,
    padding: 22,
    width: '88%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00fff9',
    marginBottom: 10,
  },
  modalInput: {
    minHeight: 64,
    backgroundColor: '#2c2c2c',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  modalCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#232323',
    borderWidth: 1,
    borderColor: '#00fff9',
  },
  modalCancelText: {
    color: '#00fff9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalSaveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#00fff9',
    marginLeft: 8,
  },
  modalSaveText: {
    color: '#232323',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
