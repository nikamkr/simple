"use client";
import { useEffect, useState } from "react";

type Todo = { id: number; text: string };

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: input }),
      headers: { "Content-Type": "application/json" },
    });
    const todo = await res.json();
    setTodos((t) => [...t, todo]);
    setInput("");
  };

  const deleteTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    setTodos((t) => t.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo: Todo) => setEditing(todo);

  const updateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id: editing.id, text: editing.text }),
      headers: { "Content-Type": "application/json" },
    });
    setTodos((t) =>
      t.map((todo) => (todo.id === editing.id ? { ...todo, text: editing.text } : todo))
    );
    setEditing(null);
  };

  return (
    <div className="todo-container">
      <div className="todo-box">
        <h1 className="todo-title">Todo List New</h1>
        <form onSubmit={editing ? updateTodo : addTodo} className="flex gap-2 mb-6">
          <input
            className="todo-input"
            placeholder="Add a todo..."
            value={editing ? editing.text : input}
            onChange={(e) =>
              editing
                ? setEditing({ ...editing, text: e.target.value })
                : setInput(e.target.value)
            }
          />
          <button
            type="submit"
            className="todo-btn"
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              className="todo-cancel-btn"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          )}
        </form>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="todo-item"
            >
              <span>{todo.text}</span>
              <div className="flex gap-2">
                <button
                  className="todo-edit"
                  onClick={() => startEdit(todo)}
                >
                  Edit
                </button>
                <button
                  className="todo-delete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
