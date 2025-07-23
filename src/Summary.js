import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Summary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const answers = state?.answers || [];

  const correctCount = answers.filter(a => a.isCorrect).length;

  return (
    <div className="summary">
      <h2>Exam Summary</h2>
      <p>You got {correctCount} out of {answers.length} correct.</p>

      {answers.map((ans, i) => (
        <div
          key={i}
          className="summary-item"
          style={{
            backgroundColor: ans.isCorrect ? '#d4edda' : '#f8d7da',
            padding: '12px',
            margin: '10px 0',
            borderRadius: '8px'
          }}
        >
          <strong>{i + 1}. {ans.question}</strong>
          <div>Your Answer: {ans.selected}</div>
          <div>Correct Answer: {ans.correct}</div>
        </div>
      ))}

      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );
}

export default Summary;
