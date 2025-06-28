import axios from "axios";
import type { Correspondent, QuestionData } from "@/types/question";
import { useQuery } from "@tanstack/react-query";
import { Buffer } from "buffer";
import data2 from "../data/data2.json"
const QUIZ_API_URL = import.meta.env.VITE_QUIZ_API_URL;
const QUIZ_API_TOKEN = import.meta.env.VITE_QUIZ_API_TOKEN;

export interface QuizResponse {
  quiz: QuestionData[];
  metadata: {
    total_questions: number;
  }
}

interface QuestionEncoded {
  audio_url: string;
  options: string;
}

interface QuizEncoded {
  quiz: QuestionEncoded[];
  metadata: {
    total_questions: number;
  }
}

export const fetchQuiz = async (): Promise<QuizEncoded> => {
  try {
    // console.log("Fetching quiz from:", QUIZ_API_URL);
    const response = await axios.get(`${QUIZ_API_URL}`, {
      headers: {
        Authorization: `Bearer ${QUIZ_API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

const dummyFetchQuiz = async (): Promise<QuizEncoded> => {
  return Promise.resolve(data2 as QuizEncoded);
}

const convert = (from: BufferEncoding, to: BufferEncoding) => (str: string): string =>
  Buffer.from(str, from).toString(to);

// const utf8ToHex = convert('utf8', 'hex')
const hexToUtf8 = convert('hex', 'utf8')

export const useQuiz = () => {
  return useQuery({
    queryKey: ['quiz'],
    queryFn: fetchQuiz,
    select: (data: QuizEncoded) => {
      return {
        quiz: data.quiz.map((question) => ({
          audio_url: question.audio_url,
          options: JSON.parse(hexToUtf8(question.options)) as Correspondent[],
        })),
        metadata: data.metadata,
      }
    }
  });
}

