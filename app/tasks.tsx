import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Swipeable } from 'react-native-gesture-handler';
import { useTaskContext, Task } from './context/TaskContext';
import TaskForm from './components/TaskForm';

const TasksScreen = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useTaskContext();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    await addTask(task);
  };

  const handleUpdateTask = async (task: Task) => {
    await updateTask(task);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(id);
          },
        },
      ]
    );
  };

  const renderRightActions = (taskId: string) => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteTask(taskId)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity 
        style={[styles.taskItem, item.completed && styles.completedTask]}
        onPress={() => setEditingTask(item)}
        onLongPress={() => toggleTaskComplete(item.id)}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>P{item.priority}</Text>
          </View>
        </View>
        {item.description && (
          <Text style={[styles.taskDescription, item.completed && styles.completedText]}>
            {item.description}
          </Text>
        )}
        <Text style={[styles.dueDate, item.completed && styles.completedText]}>
          Due: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Tasks',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowTaskForm(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.main}>
        <FlashList
          data={tasks}
          renderItem={renderTask}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <TaskForm
        visible={showTaskForm || !!editingTask}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        initialValues={editingTask || undefined}
      />
    </SafeAreaView>
  );
};

export default TasksScreen;

// Helper function to get priority color
function getPriorityColor(priority: number): string {
  switch (priority) {
    case 5:
      return '#ef4444'; // Red-500
    case 4:
      return '#f97316'; // Orange-500
    case 3:
      return '#eab308'; // Yellow-500
    case 2:
      return '#22c55e'; // Green-500
    default:
      return '#3b82f6'; // Blue-500
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#290025',
  },
  main: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    backgroundColor: '#f3f4f6',
  },
  completedText: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937', // Gray-800
    flex: 1,
  },
  taskDescription: {
    fontSize: 14,
    color: '#4b5563', // Gray-600
    marginBottom: 8,
  },
  dueDate: {
    fontSize: 12,
    color: '#6b7280', // Gray-500
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  addButton: {
    marginRight: 16,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
