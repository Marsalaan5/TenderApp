import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminPage from './pages/AdminPage';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import 'react-toastify/dist/ReactToastify.css';
import TenderNavbar from './components/Navbar';
import Footer from './components/Footer';
import AiAssistant from './pages/AiAssistant';
import Contact from './pages/Contact';
import About from './pages/About';
import TenderAdvanceSearch from './pages/TenderAdvanceSearch';



// import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <ToastContainer />
        <TenderNavbar />

        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/about-us" element={<About />} />
             <Route path="/advanced-search" element={<TenderAdvanceSearch />} />
            
<Route path="/ai" element={<AiAssistant />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}


export default App;

