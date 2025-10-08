import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginSignup from './pages/LoginSignup';
import Rides from './pages/Rides';
import Messages from './pages/Messages';
import Profile from './pages/Profile'; 
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import LearnMore from './pages/LearnMore';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
