import React from 'react';
import { Routes,Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';  
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return ( 
    <Routes>
        
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />  
        <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes> 
  );
}

export default App;