import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useAuth } from '../context/AuthContext';

function TodoList({ onTaskCountUpdate }) {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const { currentUser, logout } = useAuth();
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const CheckIcon = getIcon('Check');
  const EditIcon = getIcon('Edit');
  const LogOutIcon = getIcon('LogOut');
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Count today's tasks for the dashboard
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.date === today);
    if (onTaskCountUpdate) {
      onTaskCountUpdate(todayTasks.length);
    }
  }, [tasks, onTaskCountUpdate]);
  
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') {
      toast.warning('Task cannot be empty');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newTaskObj = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      date: today
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    toast.success('Task added successfully');
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted');
  };
  
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.info(`Task marked as ${!task.completed ? 'completed' : 'incomplete'}`);
    }
  };
  
  const filteredTasks = filter === 'all' 
    ? tasks 
    : filter === 'active' 
    ? tasks.filter(task => !task.completed) 
    : tasks.filter(task => task.completed);
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="space-y-6">
      {/* User info and logout */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-light/30 flex items-center justify-center text-primary-dark">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-surface-700 dark:text-surface-300">
              Hello, {currentUser.username}
            </p>
            <p className="text-sm text-surface-500">Manage your tasks for today</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn-outline text-sm px-3 py-1.5 flex items-center gap-1"
        >
          <LogOutIcon size={16} />
          <span>Logout</span>
        </button>
      </div>
      
      {/* Add new task form */}
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          className="input flex-1"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button 
          type="submit" 
          className="btn-primary flex-shrink-0 flex items-center gap-1"
        >
          <PlusIcon size={18} />
          <span>Add Task</span>
        </button>
      </form>
      
      {/* Filters */}
      <div className="flex gap-2">
        <button 
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === 'active' 
              ? 'bg-primary text-white' 
              : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
          }`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === 'completed' 
              ? 'bg-primary text-white' 
              : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      
      {/* Task list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-surface-100 dark:bg-surface-800 rounded-lg text-center text-surface-500"
            >
              No tasks found. Add some tasks to get started!
            </motion.div>
          ) : (
            filteredTasks.map(task => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm"
              >
                <button 
                  onClick={() => toggleComplete(task.id)}
                  className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    task.completed 
                      ? 'bg-primary-dark border-primary-dark text-white' 
                      : 'border-surface-300 dark:border-surface-600'
                  }`}
                >
                  {task.completed && <CheckIcon size={14} />}
                </button>
                <span className={`flex-1 ${task.completed ? 'line-through text-surface-400' : ''}`}>
                  {task.text}
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-surface-500 hover:text-accent rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Task stats */}
      {tasks.length > 0 && (
        <div className="text-sm text-surface-500 dark:text-surface-400">
          <p>
            {tasks.filter(task => task.completed).length} completed / {tasks.length} total tasks
          </p>
        </div>
      )}
    </div>
  );
}

export default TodoList;