import React, { useEffect, useRef } from 'react';
import { useMutation } from 'urql';
import './InsertionForm.css';

const insertTodoQuery = `mutation insertTodo($title: String!, $description: String = "", $dueTime: timestamptz = "", $creatorId: bigint!) {
  insert_todo(objects: {title: $title, description: $description, dueTime: $dueTime, creatorId: $creatorId}) {
    affected_rows
  }
}
`;

const updateTodoByIdQuery = `mutation updateTodoById($id: bigint!, $title: String!, $description: String!, $dueTime: timestamptz!) {
  update_todo(where: {id: {_eq: $id}}, _set: {title: $title, description: $description, dueTime: $dueTime}) {
    affected_rows
  }
}`;

const InsertionForm = ({ hidden, setHidden, id, update, todo }) => {
  const [insertedTodo, insertTodo] = useMutation(insertTodoQuery);
  const [updatedTodo, updateTodo] = useMutation(updateTodoByIdQuery);
  if (insertTodo.data) {
    console.log('Inserted todo: ');
    console.dir(insertedTodo.data);
  }
  if (updatedTodo.data) {
    console.log('Updated todo: ');
    console.dir(updatedTodo.data);
  }
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const dueTimeRef = useRef(null);
  useEffect(() => {
    titleRef.current.value = todo?.title || '';
    descriptionRef.current.value = todo?.description || '';
    dueTimeRef.current.value = todo?.dueTime?.slice(0, 19) || '';
  }, [todo]);
  return (
    <>
      <form
        className="InsertionForm"
        style={hidden ? { display: 'none' } : {}}
        onSubmit={async (e) => {
          e.preventDefault();
          let title = titleRef.current.value || null;
          let description = descriptionRef.current.value || null;
          let dueTime = dueTimeRef.current.value || null;

          setHidden(true);
          if (!update) {
            insertTodo({
              title,
              description,
              dueTime,
              creatorId: id,
            });
            return;
          }
          title = title || todo.title;
          description = description || todo.description;
          dueTime = dueTime || todo.dueTime;
          updateTodo({ id: todo.id, title, description, dueTime });
        }}
      >
        <div className="innerContainer">
          <div>
            <input
              type="text"
              placeholder="Title"
              ref={titleRef}
              required={!update}
            />
            <input type="text" placeholder="Description" ref={descriptionRef} />
            <button
              className="close"
              onClick={(e) => {
                e.preventDefault();
                setHidden(true);
              }}
            >
              Close
            </button>
          </div>
          <input type="datetime-local" ref={dueTimeRef} />
          <input type="submit" />
        </div>
      </form>
    </>
  );
};

export default InsertionForm;
