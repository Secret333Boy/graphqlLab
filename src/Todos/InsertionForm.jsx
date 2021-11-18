import React, { useRef } from 'react';
import { useMutation } from 'urql';
import './InsertionForm.css';

const insertTodoTemplate = `mutation insertTodo($title: String!, $description: String = "", $dueTime: timestamptz = "", $creatorId: bigint!) {
  insert_todo(objects: {title: $title, description: $description, dueTime: $dueTime, creatorId: $creatorId}) {
    affected_rows
  }
}
`;

const InsertionForm = ({ hidden, setHidden, id }) => {
  const [insertedTodo, insertTodo] = useMutation(insertTodoTemplate);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const dueTimeRef = useRef(null);
  return (
    <>
      <form
        className="InsertionForm"
        style={hidden ? { display: 'none' } : {}}
        onSubmit={async (e) => {
          e.preventDefault();
          setHidden(true);
          const title = titleRef.current.value;
          const description = descriptionRef.current.value || null;
          const dueTime = dueTimeRef.current.value || null;
          console.log(dueTime);
          console.log(
            await insertTodo({
              title,
              description,
              dueTime,
              creatorId: id,
            })
          );
        }}
      >
        <div className="innerContainer">
          <div>
            <input type="text" placeholder="Title" ref={titleRef} required />
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
