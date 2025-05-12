import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import getIcon from '../utils/iconUtils';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const UserIcon = getIcon('User');
  const LockIcon = getIcon('Lock');
  const LogInIcon = getIcon('LogIn');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    const success = login(formData.username, formData.password);
    setIsSubmitting(false);
    
    if (!success) {
      setErrors({ form: 'Invalid credentials' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to TaskMinder</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-surface-500"><UserIcon size={18} /></span>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="input pl-10" placeholder="Enter your username" />
            </div>
            {errors.username && <p className="text-accent text-sm mt-1">{errors.username}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-surface-500"><LockIcon size={18} /></span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input pl-10" placeholder="Enter your password" />
            </div>
            {errors.password && <p className="text-accent text-sm mt-1">{errors.password}</p>}
          </div>
          
          {errors.form && <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm">{errors.form}</div>}
          
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : (
              <>
                <LogInIcon size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Login;