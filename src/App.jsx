import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import MyRecipes from './pages/MyRecipes';
import AccountSettings from './pages/AccountSettings';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './utils/ProtectedRoute';
import MALCallback from './pages/MALCallback';
import LinkMAL from './pages/LinkMAL';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recipe/:slug" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/mal/callback" element={<MALCallback />} />
        <Route path="/link-mal" element={<LinkMAL />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route 
          path="/my-recipes" 
          element={
            <ProtectedRoute>
              <MyRecipes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account-settings" 
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;