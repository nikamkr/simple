import { NextRequest, NextResponse } from "next/server";

let todos: { id: number; text: string }[] = [];
let id = 1;

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const todo = { id: id++, text };
  todos.push(todo);
  return NextResponse.json(todo, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id: todoId, text } = await req.json();
  todos = todos.map((t) => (t.id === todoId ? { ...t, text } : t));
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id: todoId } = await req.json();
  todos = todos.filter((t) => t.id !== todoId);
  return NextResponse.json({ success: true });
}
