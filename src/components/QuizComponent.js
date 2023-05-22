import React, { useState, useEffect } from 'react';

const DummyData = [
  {
    question: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language'],
    answer: 'Hyper Text Markup Language'
  },
  {
    question: 'What is the correct HTML element for the largest heading?',
    options: ['<heading>', '<h6>', '<h1>'],
    answer: '<h1>'
  },
  {
    question: 'Which character entity represents the ampersand symbol (&) in HTML?',
    options: ['&copy;', '&amp;', '&lt;'],
    answer: '&amp;'
  },
  {
    question: 'In HTML, what is the purpose of the <a> element?',
    options: ['To define a paragraph', 'To define a link', 'To define a table'],
    answer: 'To define a link'
  },
  {
    question: 'Which HTML attribute specifies an alternate text for an image?',
    options: ['alt', 'src', 'href'],
    answer: 'alt'
  }
];

const QuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [randomizedOptions, setRandomizedOptions] = useState([]);

  useEffect(() => {
    let countdownTimer;

    if (timeLeft > 0 && !showFeedback && currentQuestion < DummyData.length) {
      countdownTimer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback && currentQuestion < DummyData.length) {
      handleTimeExpired();
    }

    return () => clearTimeout(countdownTimer);
  }, [timeLeft, showFeedback, currentQuestion]);

  useEffect(() => {
    if (currentQuestion < DummyData.length) {
      setRandomizedOptions(shuffleArray(DummyData[currentQuestion].options));
    }
  }, [currentQuestion]);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    if (currentQuestion === DummyData.length - 1) {
      setShowScore(true);
    } else {
      setShowFeedback(false);
      setSelectedOption('');
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15);
      setTimeExpired(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (!timeExpired) {
      if (selectedOption === DummyData[currentQuestion].answer) {
        setScore(score + 1);
      }
      setShowFeedback(true);
    }
  };

  const handleTimeExpired = () => {
    setTimeExpired(true);
    if (selectedOption === '') {
      setShowFeedback(true);
    } else {
      handleAnswerSubmit();
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption('');
    setShowFeedback(false);
    setScore(0);
    setTimeLeft(15);
    setTimeExpired(false);
    setShowScore(false);
  };

  const renderOptions = () => {
    return randomizedOptions.map((option, index) => (
      <div key={index}>
        <label>
          <input
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
            disabled={showFeedback || timeExpired}
          />
          {option}
        </label>
      </div>
    ));
  };

  const renderFeedback = () => {
    if (showFeedback || timeExpired) {
      const isCorrect = selectedOption === DummyData[currentQuestion].answer;
      let feedbackText = '';

      if (timeExpired && selectedOption === '') {
        feedbackText = 'Time expired!';
      } else if (isCorrect) {
        feedbackText = 'Correct!';
      } else {
        feedbackText = `Incorrect! The correct answer is: ${DummyData[currentQuestion].answer}`;
      }

      return (
        <div>
          <p>{feedbackText}</p>
          {currentQuestion === DummyData.length - 1 ? (
            <button onClick={handleNextQuestion}>Show Score</button>
          ) : (
            <button onClick={handleNextQuestion}>Next Question</button>
          )}
        </div>
      );
    }
    return null;
  };

  const renderResult = () => {
    if (showScore) {
      return (
        <div>
          <p>Your score: {score}/{DummyData.length}</p>
          <button onClick={handleRestartQuiz}>Try Again</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h1>HTML Quiz</h1>
      {showScore ? (
        renderResult()
      ) : (
        <>
          <h2>Question {currentQuestion + 1}:</h2>
          <p>{DummyData[currentQuestion].question}</p>
          {renderOptions()}
          <button onClick={handleAnswerSubmit} disabled={showFeedback || selectedOption === '' || timeExpired}>
            Submit
          </button>
          <p>Time Left: {timeLeft} seconds</p>
          {renderFeedback()}
        </>
      )}
    </div>
  );
};

export default QuizComponent;
