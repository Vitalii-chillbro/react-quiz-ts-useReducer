import { createContext, useContext, useReducer } from 'react';

export interface Question {
    category: string;
    type: "boolean" | "multiple";
    difficulty: "easy" | "medium" | "hard";
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuestionResponse {
    response_code: number;
    results: Question[]
}

interface Score {
    correct: number,
    incorrect: number
}

interface QuizContext {
    state: QuizState,
    dispatch: React.Dispatch<QuizAction>
}

interface QuizState {
    question: Question | null,
    gameStatus: Status,
    userAnswer: string | null,
    score: Score
}

type Status = "idle" | "fetching" | "ready" | "error" | "answered";

type QuizAction =
    { type: "setStatus"; payload: Status } |
    { type: "setQuestion"; payload: Question } |
    { type: "setUserAnswer"; payload: string | null } |
    { type: "setScore", payload: "correct" | "incorrect" }


const initialState: QuizState = {
    gameStatus: "idle",
    question: null,
    userAnswer: null,
    score: { correct: 0, incorrect: 0 }
}

const QuizContext = createContext<QuizContext>({
    state: initialState,
    dispatch: () => null
});

export function QuizProvider({ children }: { children: React.ReactElement }) {
    const [state, dispatch] = useReducer(QuizReducer, initialState);

    return (
        <QuizContext.Provider value={{ state, dispatch }}>
            {children}
        </QuizContext.Provider>
    )
}

export function useQuiz() {
    return useContext(QuizContext);
}

function QuizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case "setQuestion":
            return { ...state, question: action.payload };
        case "setStatus":
            return { ...state, gameStatus: action.payload };
        case "setUserAnswer":
            return { ...state, userAnswer: action.payload };
        case "setScore":
            let score = state.score;
            score[action.payload] += 1;
            return { ...state, score: score };
        default:
            throw new Error("Unknown action");
    }
}