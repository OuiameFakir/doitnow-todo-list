// React Query
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ITodos } from "../types/Type";
import { useTodoQuery } from "./queryDeclaration";
import { Link } from "react-router-dom";

function Todos() {
  const { TodoQuery } = useTodoQuery();
  const { isLoading, data } = TodoQuery;

  return (
    <div>
      {isLoading ? (
        "Content is Loading"
      ) : (
        <div className="container">
          <div className="m-3">
            <Link to="/" className="text-decoration-none">
              {`<- Home`}
            </Link>
          </div>
          <br />
          <h2 className="text text-warning">Fetching an API of Todos</h2>
          <div>
            {data.map((todo: ITodos) => (
              <div key={todo.id}>
                <input type="checkbox" checked={todo.completed} readOnly />
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    marginLeft: 8,
                  }}
                >
                  {todo.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Todos;
