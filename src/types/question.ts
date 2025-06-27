export interface Correspondent {
    id: number;
    full_name: string;
    is_answer: boolean;
}

export interface QuestionData {
    audio_url: string;
    options: Correspondent[];
}