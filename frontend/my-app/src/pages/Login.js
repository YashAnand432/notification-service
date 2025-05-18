import { useContext, useState } from 'react';
import apiClient from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../contexts/NotificationContext';

const Login = () => {
  
  const {login} = useContext(NotificationContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userResponse = await apiClient.post('/users/get-user-id', { email });
    
      if (!userResponse.data.userId) {
        throw new Error('User not found');
      }
      
      const { data } = await apiClient.post('/login', { email });
      
      if (data.token && data.userId) {
        console.log(data.token);
        console.log(data.userId);
        localStorage.setItem('authToken', data.token);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        login(data.token , data.userId);
        
        navigate('/send') // Redirect after login
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    console.error('Login error:', err);
    } finally {
      if (!window.location.href.includes('/send')) {
      setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login with Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="example@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;