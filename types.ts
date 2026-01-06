export interface Question {
  id: number;
  text: string;
  imageEquation?: string; // HTML string or SVG for the chemical formula in question
  options: {
    id: string; // 'A', 'B', 'C', 'D'
    text: string;
    image?: string; // HTML string or SVG for the visual answer option
  }[];
  correctAnswer: string;
  explanation?: string;
}

export interface Deck {
  id: number;
  name: string;
  totalQuestions: number;
}

export type ScreenState = 'HOME' | 'QUIZ' | 'RESULT';