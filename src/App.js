import React, { useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import Calendar from './components/pages/Calender'
import SignIn from './components/pages/SignInP'
import SignUp from './components/pages/SignUpP'
import { BrowserRouter as Router, Routes, Route} from 
'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';



function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/calendar' element={
            <PrivateRoute>
            <Calendar />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
