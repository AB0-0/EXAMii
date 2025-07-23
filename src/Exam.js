import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { ThemeContext } from "./App";

function Exam() {
    const { state } = useLocation();
    const navi = useNavigate();
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const data = Papa.parse(state.csv.trim(), { skipEmptyLines: true }).data;

        const parsed = data.slice(1).map(row => {
            const question = row[0];
            const correct = row[1].replace(/"/g, '').trim();

            let choices;
            if (['true', 'false'].includes(correct.toLowerCase()) && row.length === 2) {
                // Ensure always shows True first then False
                choices = ['True', 'False'];
            } else {
                const extraChoices = row.slice(2).map(c => c.replace(/"/g, '').trim());
                choices = [correct, ...extraChoices].sort(() => Math.random() - 0.5);
            }

            return { question, correct, choices };
        });

        setQuestions(parsed.sort(() => Math.random() - 0.5));
    }, [state.csv]);

    const current = questions[index];

    const handleSelect = (choice) => {
        if (!current) return;

        const isCorrect = choice.trim().toLowerCase() === current.correct.trim().toLowerCase();
        setSelected(choice);
        setFeedback(isCorrect ? '✔ Correct!' : `✖ Wrong! Answer: ${current.correct}`);

        if (isCorrect) setScore(prev => prev + 1);

        setTimeout(() => {
            setFeedback(null);
            setSelected('');
            if (index < questions.length - 1) {
                setIndex(i => i + 1);
            } else {
                alert(`Exam Finished!\nScore: ${score + (isCorrect ? 1 : 0)} / ${questions.length}`);
                navi('/');
            }
        }, 1500);
    };

    if (questions.length === 0 || !current) {
        return <div className="exam"><p>Loading questions...</p></div>;
    }

    return (
        <div className="exam">
            <header>
                <h2>Question {index + 1} / {questions.length}</h2>
                <button className="theme-toggle" onClick={() => setDarkMode(d => !d)}>
                    {darkMode ? '☼ Light Mode' : '☾ Dark Mode'}
                </button>
            </header>

            <div className="question-box">
                <p>{current.question}</p>
                <div className="choices">
                    {current.choices.map((c, i) => {
                        let className = 'choice-btn';
                        if (selected) {
                            if (c === selected && c === current.correct) className += ' correct';
                            else if (c === selected && c !== current.correct) className += ' wrong';
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(c)}
                                className={className}
                                disabled={!!selected}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>

                {feedback && (
                    <div className={`feedback ${feedback.startsWith('✔') ? 'correct' : 'wrong'}`}>
                        {feedback}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Exam;