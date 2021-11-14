import React from 'react';
import { useSubscription } from 'urql';

const TodosQuery = `subscription subscribeTodos {
  todo {
    id
    title
    description
    creation_time
    due_time
    creator_id
  }
}`;

const Todos = () => {
  const [result] = useSubscription({ query: TodosQuery });
  const { fetching, error, data } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;
  return (
    <table>
      <tbody>
        <tr>
          <td>ID</td>
          <td>Title</td>
          <td>Description</td>
          <td>Creation time</td>
          <td>Due time</td>
          <td>Creator ID</td>
        </tr>
        {data.todo.map((todo) => (
          <tr key={todo.id}>
            {Object.entries(todo).map(([key, data]) => (
              <td key={key}>{data}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Todos;
