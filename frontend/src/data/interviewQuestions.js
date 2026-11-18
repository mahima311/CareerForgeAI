
const interviewQuestions = {
  technical: [
    {
      question: "Which of the following is used to manage memory dynamically in C++?",
      options: ["malloc only", "new and delete", "static", "const"],
      correctAnswer: 1,
      explanation: "C++ uses new to allocate memory dynamically and delete to release it."
    },
    {
      question: "Which data structure follows LIFO?",
      options: ["Queue", "Array", "Stack", "Linked List"],
      correctAnswer: 2,
      explanation: "Stack follows Last In, First Out (LIFO)."
    },
    {
      question: "Which SQL command is used to retrieve data?",
      options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
      correctAnswer: 2,
      explanation: "SELECT is used to retrieve records from a database."
    },
    {
      question: "Which React hook is used to manage component state?",
      options: ["useEffect", "useState", "useRef", "useMemo"],
      correctAnswer: 1,
      explanation: "useState allows functional components to manage state."
    },
    {
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Internet",
        "Application Process Integration",
        "Automated Program Instruction"
      ],
      correctAnswer: 0,
      explanation: "API stands for Application Programming Interface."
    }
  ],

  aptitude: [
    {
      question: "What is 20% of 250?",
      options: ["25", "40", "50", "60"],
      correctAnswer: 2,
      explanation: "20% of 250 = (20 / 100) × 250 = 50."
    },
    {
      question: "Find the next number: 2, 4, 8, 16, ?",
      options: ["20", "24", "30", "32"],
      correctAnswer: 3,
      explanation: "Each number is multiplied by 2. Therefore, 16 × 2 = 32."
    },
    {
      question: "A person travels 120 km in 2 hours. What is the average speed?",
      options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"],
      correctAnswer: 2,
      explanation: "Speed = Distance / Time = 120 / 2 = 60 km/h."
    },
    {
      question: "If 5 workers complete a task in 10 days, how many days will 10 workers take?",
      options: ["2 days", "5 days", "10 days", "20 days"],
      correctAnswer: 1,
      explanation: "For the same work, doubling workers halves the time: 5 days."
    },
    {
      question: "Find the odd one out.",
      options: ["Apple", "Mango", "Carrot", "Banana"],
      correctAnswer: 2,
      explanation: "Carrot is a vegetable; the others are fruits."
    }
  ],

  hr: [
    {
      question: "Tell me about yourself.",
      type: "subjective",
      sampleAnswer: "I am a final-year Computer Science student with an interest in Software Development and Data Analytics. I have worked on academic and personal projects using Python, SQL, JavaScript and React.js."
    },
    {
      question: "Why should we hire you?",
      type: "subjective",
      sampleAnswer: "I have a strong foundation in computer science, a willingness to learn and the ability to work consistently. I am eager to apply my skills and contribute to the team."
    },
    {
      question: "What are your strengths?",
      type: "subjective",
      sampleAnswer: "My strengths include problem-solving, adaptability, continuous learning and a responsible approach towards tasks."
    },
    {
      question: "Where do you see yourself in five years?",
      type: "subjective",
      sampleAnswer: "I see myself as a skilled professional with strong technical knowledge, contributing to meaningful projects and taking greater responsibilities."
    },
    {
      question: "Why do you want to join our company?",
      type: "subjective",
      sampleAnswer: "I want to work in an environment where I can learn from experienced professionals, improve my technical skills and contribute to real-world projects."
    }
  ]
};

export default interviewQuestions;
