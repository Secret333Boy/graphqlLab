import React from 'react';
import { useSubscription } from 'urql';

const TodosQueryTemplate = `subscription subscribeTodosByID {
  todo(limit: 10, offset: 0, where: {creator_id: {_eq: "$id"}}) {
    id
    title
    description
    creation_time
    due_time
  }
}`;

const Todos = ({ id }) => {
  const TodosQuery = TodosQueryTemplate.replace('$id', id);
  const [result] = useSubscription({ query: TodosQuery });
  const { fetching, error, data } = result;
  if (fetching || !id) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>ID</td>
            <td>Title</td>
            <td>Description</td>
            <td>Creation time</td>
            <td>Due time</td>
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
    </div>
  );
};

export default Todos;
