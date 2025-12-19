import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Nếu user chưa xác định (undefined), show loading
  if (user === undefined) {
    return <div>Đang tải...</div>;
  }

  // Nếu user null (chưa đăng nhập), redirect về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, render children
  return children;
};

export default ProtectedRoute;