import React, { useState } from 'react';
import InsertionForm from './InsertionForm.jsx';
import { useMutation, useSubscription } from 'urql';

const TodosQueryTemplate = `subscription subscribeTodosByID {
  todo(limit: 10, offset: 0, where: {creatorId: {_eq: "$id"}}) {
    id
    title
    description
    creationTime
    dueTime
  }
}`;

const removeTodoByIdTemplate = `mutation removeTodoById($id: bigint = "") {
  delete_todo(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`;

const Todos = ({ id }) => {
  const [removedTodo, removeTodo] = useMutation(removeTodoByIdTemplate);
  const [insertionFormHidden, setInsertionFormHidden] = useState(true);
  const TodosQuery = TodosQueryTemplate.replace('$id', id);
  const [result] = useSubscription({ query: TodosQuery });
  const { fetching, error, data } = result;
  if (fetching || !id) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;
  const todos = data.todo;
  return (
    <>
      <InsertionForm
        hidden={insertionFormHidden}
        setHidden={setInsertionFormHidden}
        id={id}
      />
      <table style={{ width: '10px' }}>
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
                <button>Change</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setInsertionFormHidden(false)}>Add todo</button>
    </>
  );
};

export default Todos;
