import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import TodoList from '../components/TodoList';
import Login from '../components/Login';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [todayTasksCount, setTodayTasksCount] = useState(0);
  
  // Icons
  const CalendarIcon = getIcon('Calendar');
  const ListChecksIcon = getIcon('ListChecks');
  const ArrowRightIcon = getIcon('ArrowRight');
  const StarIcon = getIcon('Star');
  
  // Get authentication state
  const { isAuthenticated } = useAuth();
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const updateTaskCount = (count) => {
    setTodayTasksCount(count);
  };
  
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-16 h-16 border-4 border-primary-light rounded-full border-t-transparent"
        />
      </div>
    );
  }

  // Common page elements
  const renderStats = () => (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="card bg-gradient-to-br from-primary-light/10 to-primary/10 dark:from-primary-dark/20 dark:to-primary-light/10 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-surface-500 dark:text-surface-300 text-sm font-medium">Today's Tasks</p>
            <h3 className="text-2xl font-bold mt-1">{todayTasksCount}</h3>
          </div>
          <div className="p-2 rounded-full bg-primary/10 text-primary dark:text-primary-light">
            <CalendarIcon size={20} />
          </div>
        </div>
      </div>
      
      <div className="card bg-gradient-to-br from-secondary-light/10 to-secondary/10 dark:from-secondary-dark/20 dark:to-secondary-light/10 border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-surface-500 dark:text-surface-300 text-sm font-medium">Completed Tasks</p>
            <h3 className="text-2xl font-bold mt-1">0</h3>
          </div>
          <div className="p-2 rounded-full bg-secondary/10 text-secondary dark:text-secondary-light">
            <ListChecksIcon size={20} />
          </div>
        </div>
      </div>
      
      <div className="card md:col-span-2 lg:col-span-1 bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-surface-500 dark:text-surface-300 text-sm font-medium">Task Streak</p>
            <h3 className="text-2xl font-bold mt-1">0 days</h3>
          </div>
          <div className="p-2 rounded-full bg-accent/10 text-accent">
            <StarIcon size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome section */}
        <motion.div variants={itemVariants} className="mt-4 mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white">
            {isAuthenticated ? 'Your Tasks' : 'Welcome to TaskMinder'}
          </h1>
          <p className="text-surface-600 dark:text-surface-300 text-lg">
            {isAuthenticated 
              ? 'Manage your tasks efficiently and stay productive'
              : 'Your personal task management solution for increased productivity'
            }
          </p>
        </motion.div>

        {isAuthenticated ? (
          <>
            {/* Stats overview for authenticated users */}
            {renderStats()}

            {/* Task List Component */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>Task Manager</span>
                  <ArrowRightIcon size={18} className="text-primary" />
                </h2>
              </div>
              <TodoList onTaskCountUpdate={updateTaskCount} />
            </motion.div>
          </>
        ) : (
          <Login />
        )}
      </motion.div>
    </div>
  );
}

export default Home;