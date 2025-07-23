import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { ThemeContext } from "./App";

function Exam() {
  const { state } = useLocation();
  const navi = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const data = Papa.parse(state.csv.trim(), { skipEmptyLines: true }).data;
    const parsed = data.slice(1).map((row) => {
      const question = row[0];
      const correct = row[1].replace(/"/g, "").trim();
      let choices;

      if (["true", "false"].includes(correct.toLowerCase()) && row.length === 2) {
        choices = correct.toLowerCase() === "true" ? ["True", "False"] : ["True", "False"];
      } else {
        const others = row.slice(2).map((x) => x.replace(/"/g, "").trim());
        choices = [correct, ...others].sort(() => Math.random() - 0.5);
      }

      return { question, correct, choices };
    });

    setQuestions(parsed.sort(() => Math.random() - 0.5));
  }, [state.csv]);

  const current = questions[index];

  const handleSelect = (choice) => {
    const isCorrect = choice.trim().toLowerCase() === current.correct.trim().toLowerCase();

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected: choice,
        correct: current.correct,
        isCorrect: isCorrect,
      },
    ]);

    setSelected(choice);
    setFeedback(isCorrect ? "✔ Correct!" : `✖ Wrong! Answer: ${current.correct}`);

    setTimeout(() => {
      setFeedback(null);
      setSelected("");
      if (index < questions.length - 1) {
        setIndex((i) => i + 1);
      } else {
        navi("/summary", { state: { answers: [...userAnswers, {
          question: current.question,
          selected: choice,
          correct: current.correct,
          isCorrect: isCorrect,
        }] } });
      }
    }, 1500);
  };

  return (
    <div className={`exam ${darkMode ? "dark" : "light"}`}>
      <header>
        <h2>
          Question {index + 1} / {questions.length}
        </h2>
        <button className="theme-toggle" onClick={() => setDarkMode((d) => !d)}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <div className="question-box">
        <p>{current?.question}</p>
        <div className="choices">
          {current?.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleSelect(c)}
              className={`choice-btn ${
                selected === c
                  ? current.correct.trim().toLowerCase() === c.trim().toLowerCase()
                    ? "correct"
                    : "wrong"
                  : ""
              }`}
              disabled={!!selected}
            >
              {c}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`feedback ${feedback.startsWith("✔") ? "correct" : "wrong"}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

export default Exam;
