import React, { useState } from 'react';
import InsertionForm from './InsertionForm.jsx';
import { useMutation, useSubscription } from 'urql';

const TodosQuery = `subscription TodosQuery {
  todo {
    id
    title
    description
    creationTime
    dueTime
  }
}`;

const removeTodoByIdQuery = `mutation removeTodoById($id: bigint) {
  delete_todo(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`;

const Todos = () => {
  const [removedTodo, removeTodo] = useMutation(removeTodoByIdQuery);
  if (removedTodo.data) {
    console.log('Removed todo:');
    console.dir(removedTodo.data);
  }
  const [insertionFormHidden, setInsertionFormHidden] = useState(true);
  const [updateFormHidden, setUpdateFormHidden] = useState(true);
  const [updatingTodo, setUpdatingTodo] = useState(null);
  const [result] = useSubscription({ query: TodosQuery });
  const { fetching, error, data } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;
  const todos = data.todo;
  return (
    <>
      <InsertionForm
        hidden={insertionFormHidden}
        setHidden={setInsertionFormHidden}
      />
      <InsertionForm
        hidden={updateFormHidden}
        setHidden={setUpdateFormHidden}
        update="true"
        todo={updatingTodo}
      />
      <table>
        <tbody>
          <tr>
            <td>ID</td>
            <td>Title</td>
            <td>Description</td>
            <td>Creation time</td>
            <td>Due time</td>
            <td>Operations</td>
          </tr>
          {todos.map((todo) => (
            <tr key={todo.id}>
              {Object.entries(todo).map(([key, data]) => (
                <td key={key}>{data}</td>
              ))}
              <td>
                <button
                  onClick={() => {
                    removeTodo({ id: todo.id });
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setUpdatingTodo(todo);
                    setUpdateFormHidden(false);
                  }}
                >
                  Change
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setInsertionFormHidden(false);
        }}
      >
        Add todo
      </button>
    </>
  );
};

export default Todos;
