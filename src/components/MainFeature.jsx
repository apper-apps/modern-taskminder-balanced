import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import getIcon from "../utils/iconUtils";

function MainFeature({ onTaskCountUpdate }) {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("taskminder-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  
  // Icons
  const PlusIcon = getIcon("Plus");
  const TrashIcon = getIcon("Trash2");
  const EditIcon = getIcon("Edit");
  const CheckIcon = getIcon("Check");
  const XIcon = getIcon("X");
  const ClipboardList = getIcon("ClipboardList");
  const FilterIcon = getIcon("Filter");
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isFirstRender) {
      localStorage.setItem("taskminder-tasks", JSON.stringify(tasks));
      
      // Count today's tasks for the dashboard
      const todayStart = new Date().setHours(0, 0, 0, 0);
      const todayTasks = tasks.filter(
        task => new Date(task.createdAt).setHours(0, 0, 0, 0) === todayStart
      );
      
      onTaskCountUpdate(todayTasks.length);
    } else {
      setIsFirstRender(false);
    }
  }, [tasks, isFirstRender, onTaskCountUpdate]);
  
  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const addTask = (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) {
      toast.error("Task cannot be empty", {
        position: "bottom-right",
        icon: "⚠️",
      });
      return;
    }
    
    const newTaskItem = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks([newTaskItem, ...tasks]);
    setNewTask("");
    inputRef.current.focus();
    
    toast.success("Task added successfully!", {
      position: "bottom-right",
      icon: "✅",
    });
  };
  
  const toggleTaskComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.info("Task removed", {
      position: "bottom-right",
      icon: "🗑️",
    });
  };
  
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };
  
  const saveEdit = () => {
    if (!editText.trim()) {
      toast.error("Task cannot be empty", {
        position: "bottom-right",
        icon: "⚠️",
      });
      return;
    }
    
    setTasks(
      tasks.map((task) =>
        task.id === editingId ? { ...task, text: editText.trim() } : task
      )
    );
    
    setEditingId(null);
    setEditText("");
    
    toast.success("Task updated", {
      position: "bottom-right",
      icon: "📝",
    });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };
  
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (editingId) {
        saveEdit();
      } else {
        addTask(e);
      }
    } else if (e.key === "Escape" && editingId) {
      cancelEdit();
    }
  };
  
  // Filter tasks based on selected status
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return !task.completed;
    if (filterStatus === "completed") return task.completed;
    return true;
  });
  
  // Task animation variants
  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="neu-card dark:bg-surface-800 overflow-hidden">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <ClipboardList className="text-primary dark:text-primary-light" size={24} />
        <span>My Tasks</span>
      </h3>
      
      {/* Add task form */}
      <form onSubmit={addTask} className="mb-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="input"
            maxLength={100}
          />
          <button
            type="submit"
            className="btn-primary shrink-0 flex items-center gap-1"
            aria-label="Add task"
          >
            <PlusIcon size={18} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </form>
      
      {/* Filter buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1">
          <FilterIcon size={14} />
          <span>Filter:</span>
        </div>
        <div className="flex p-1 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterStatus === "all"
                ? "bg-white dark:bg-surface-600 shadow-sm"
                : "text-surface-600 dark:text-surface-300 hover:bg-white/50 dark:hover:bg-surface-600/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterStatus === "active"
                ? "bg-white dark:bg-surface-600 shadow-sm"
                : "text-surface-600 dark:text-surface-300 hover:bg-white/50 dark:hover:bg-surface-600/50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterStatus === "completed"
                ? "bg-white dark:bg-surface-600 shadow-sm"
                : "text-surface-600 dark:text-surface-300 hover:bg-white/50 dark:hover:bg-surface-600/50"
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Task list */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 scrollbar-hide">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-3 mx-auto w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <ClipboardList size={24} className="text-surface-400 dark:text-surface-500" />
            </div>
            <p className="text-surface-500 dark:text-surface-400">
              {filterStatus === "all" 
                ? "You don't have any tasks yet" 
                : filterStatus === "active"
                ? "No active tasks"
                : "No completed tasks"}
            </p>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="text-primary dark:text-primary-light text-sm hover:underline mt-1"
              >
                Show all tasks
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex items-center p-3 rounded-lg border ${
                  task.completed
                    ? "bg-surface-50/50 dark:bg-surface-800/30 border-surface-200/50 dark:border-surface-700/50"
                    : "bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700"
                } shadow-sm transition-all group hover:shadow-md`}
              >
                {editingId === task.id ? (
                  // Edit mode
                  <div className="flex items-center gap-2 w-full">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="input flex-1"
                      maxLength={100}
                    />
                    <button
                      onClick={saveEdit}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                      aria-label="Save edit"
                    >
                      <CheckIcon size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                      aria-label="Cancel edit"
                    >
                      <XIcon size={18} />
                    </button>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskComplete(task.id)}
                          className="checkbox"
                        />
                      </div>
                      
                      {/* Task text */}
                      <span
                        className={`flex-1 break-words transition-all ${
                          task.completed
                            ? "text-surface-400 dark:text-surface-500 line-through"
                            : "text-surface-700 dark:text-surface-200"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                    
                    {/* Task actions */}
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-1.5 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                        aria-label="Edit task"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                        aria-label="Delete task"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {/* Tasks summary */}
      {tasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700 text-sm text-surface-500 dark:text-surface-400 flex justify-between">
          <span>
            {tasks.filter(t => !t.completed).length} item{tasks.filter(t => !t.completed).length !== 1 ? 's' : ''} left
          </span>
          {tasks.some(t => t.completed) && (
            <button
              onClick={() => {
                setTasks(tasks.filter(t => !t.completed));
                toast.info("Completed tasks cleared", { position: "bottom-right" });
              }}
              className="text-primary dark:text-primary-light hover:underline"
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MainFeature;