"use client";

import { User } from "@/db";
import { FC, useReducer, FormEvent, useState } from "react";

type Props = {
  user: User;
};

type State = {
  name: string;
  email: string;
};

type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "RESET"; payload: State };

const initialState = (user: User): State => ({
  name: user.name,
  email: user.email,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};

export const Form: FC<Props> = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState(user));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetch("http://localhost:3000/api/users/" + user.id, {
        method: "PUT",
        body: JSON.stringify(state),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    } catch {}

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={state.name}
          className="border p-2"
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={state.email}
          className="border p-2"
          onChange={(e) =>
            dispatch({ type: "SET_EMAIL", payload: e.target.value })
          }
        />
      </div>
      {isLoading ? "Loading" : <button type="submit">Save</button>}
    </form>
  );
};
