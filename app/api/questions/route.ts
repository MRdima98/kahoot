import { NextRequest, NextResponse } from 'next/server';
import questions from "../../../public/database.json";

export function GET(_req: NextRequest) {
  return NextResponse.json(questions);
}
