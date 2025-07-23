import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Exam from './Exam';
import './style.css';

export const ThemeContext = React.createContext();

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={darkMode ? 'dark mode' : 'light mode'}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/exam' element={<Exam />} />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
