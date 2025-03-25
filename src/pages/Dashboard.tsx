import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, TrendingUp, Apple, CheckSquare, Plus, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', title: 'Complete morning workout', completed: false, dueDate: '2025-03-25' },
    { id: '2', title: 'Track meals for the day', completed: true, dueDate: '2025-03-25' },
    { id: '3', title: 'Drink 8 glasses of water', completed: false, dueDate: '2025-03-25' }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: newTodo,
      completed: false,
      dueDate: newTodoDueDate || undefined
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    setNewTodoDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/workout-plans" className="block">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Activity className="h-8 w-8 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Workout Plans</h2>
            <p className="text-gray-600">View and manage your workout routines</p>
          </div>
        </Link>

        <Link to="/diet-tracking" className="block">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Apple className="h-8 w-8 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Diet Tracking</h2>
            <p className="text-gray-600">Log and monitor your nutrition</p>
          </div>
        </Link>

        <Link to="/progress" className="block">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Progress</h2>
            <p className="text-gray-600">Track your fitness journey</p>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <CheckSquare className="h-6 w-6 text-purple-600 mr-2" />
              Today's Tasks
            </h2>
            <span className="text-sm text-gray-500">
              {todos.filter(todo => todo.completed).length}/{todos.length} completed
            </span>
          </div>

          <form onSubmit={handleAddTodo} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="date"
                value={newTodoDueDate}
                onChange={(e) => setNewTodoDueDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  todo.completed ? 'bg-gray-50' : 'bg-white'
                } border border-gray-200`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {todo.title}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {todo.dueDate && (
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}