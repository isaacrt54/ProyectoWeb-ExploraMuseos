import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Navbar from './components/Navbar';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MuseumDetails from './pages/MuseumDetails';
import Profile from './pages/Profile';
// Admin Pages
import Users from './pages/admin/Users';
import Museums from './pages/admin/Museums';
// Routes
import AdminRoute from './routes/AdminRoute';
import PrivateRoute from './routes/PrivateRoute';

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/museums/:museumId" element={<MuseumDetails />} />

      {/* Protected routes (only for logged-in users) */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Protected routes (only admin users) */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />
      
      <Route
        path="/admin/museums"
        element={
          <AdminRoute>
            <Museums />
          </AdminRoute>
        }
      />
    </Routes>
  </>
);

export default App;
