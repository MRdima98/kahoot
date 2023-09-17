import { Ref, RefObject } from "react";

export interface Quiz {
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    correct: string;
    path: string;
}

export interface Cool_message {
    msg: string | undefined;
    ref: RefObject<HTMLDivElement>;
}
