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
                    <button onClick={()=> preloadExam('progman_m1.csv')}>Progman Module 1</button>
                    <button onClick={()=> preloadExam('progman_m2.csv')}>Progman Module 2</button>
                    <button onClick={()=> preloadExam('progman_m3.csv')}>Progman Module 3</button>
                    <button onClick={()=> preloadExam('progman_qa.csv')}>Progman Module 3</button>
                    <button onClick={()=> preloadExam('progman_true_false.csv')}>Progman Module 3</button>
                    <button onClick={()=> preloadExam('progman_pmroles.csv')}>Progman Module 3</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
