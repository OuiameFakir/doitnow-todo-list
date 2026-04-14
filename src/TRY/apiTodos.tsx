// React Query
import React from "react";
import { Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ITodos } from "../types/Type";
import { useTodoQuery } from "./queryDeclaration";
import { UseFormReturn, useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

interface IMyFormValues {
  todoTitle: string;
}
function Todos() {
  const { TodoQuery, TodoMutation } = useTodoQuery();
  const { mutateAsync: addMutation } = TodoMutation;
  const { isLoading, data } = TodoQuery;
  const { register, handleSubmit, reset }: UseFormReturn<IMyFormValues> =
    useForm<IMyFormValues>();

  const onSubmit: SubmitHandler<IMyFormValues> = async (data) => {
    try {
      await addMutation();
      reset();
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        "Content is Loading"
      ) : (
        <div className="container">
          <div className="m-3">
            <Link to="/" className="text-decoration-none">
              {" "}
              {`<-  Home`}{" "}
            </Link>
          </div>
          <br />
          <h2 className="text text-warning">Fetching an API of Todos</h2>
          <Row>
            {data.map((todo: ITodos) => {
              return (
                <div>
                  <input type="checkbox" checked={todo.completed} />
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.title}
                  </span>
                </div>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
}

export default Todos;
