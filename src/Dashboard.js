import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './App';

function Dashboard() {
    const navi = useNavigate();
    const { darkMode, setDarkMode} = useContext(ThemeContext);

    const upload = async(e) => {
        const file =e.target.files[0];
        if (!file) return;

        const examContent = await file.text();
        navi('/exam', {state: {csv: examContent } });
    };
    const preloadExam = async(filename)=> {
        const res = await fetch(`/exams/${filename}`);
        const text = await res.text();
        navi('/exam', { state: {csv: text} });
    };

    return(
        <div className='dashboard'>
            <header>
                <h1>EXAMii Dashboard</h1>
                <button className="theme-toggle" onClick={() => setDarkMode(d => !d)}>{darkMode ? '☼ Light Mode' : '☾ Dark Mode'}</button>

            </header>

            <div className='card'>
                <label className='upload-btn'>
                    Upload csv
                    <input type='file' accept='.csv' hidden onChange={upload}/>
                </label>

                <h2>Preloaded Exams:</h2>
                <div className='preload-btn'>
                    <button onClick={()=> preloadExam('progman_m4-5.csv')}>ProgMan Module 4-5</button>
                    <button onClick={()=> preloadExam('progman_m6_time.csv')}>ProgMan Module 6: Time Management</button>
                    <button onClick={()=> preloadExam('progman_midterm_exam.csv')}>Progman Midterm Exam</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;





