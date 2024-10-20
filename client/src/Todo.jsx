import { Progress } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
const Todo = () => {
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
    status: "false",
  });
  const [isUpdate, setIsUpdate] = useState("");

  let total = todo;

  let running = todo.filter((item) => {
    return item.status === false;
  });

  let complete = todo.filter((item) => {
    return item.status === true;
  });

  let x = total.length;
  let y = complete.length;
  let z = running.length;

  const completePercent = (y / x) * 100;

  const finalCompletePercent = completePercent.toFixed(2);

  const runningPercent = (z / x) * 100;

  const finalRunningPercent = runningPercent.toFixed(2);

  const getAll = () => {
    axios
      .get("http://localhost:4000/get-todo")
      .then((res) => {
        setTodo(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAll();
  }, []);
  const handleChange = (e) => {
    const name = e.target.name;
    setInput((prev) => {
      return {
        ...prev,
        [name]: e.target.value,
      };
    });
  };

  const addOrUpdate = (e) => {
    e.preventDefault();
    if (isUpdate) {
      axios
        .post("http://localhost:4000/update-todo", {
          _id: isUpdate,
          title: input.title,
          description: input.description,
        })
        .then((res) => {
          console.log(res);
          getAll();
          setInput({ title: "", description: "" });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post("http://localhost:4000/save-todo", {
          title: input.title,
          description: input.description,
        })
        .then((res) => {
          console.log(res);
          getAll();
          setInput({ title: "", description: "" });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateTodo = (_id, title, description) => {
    setIsUpdate(_id);
    setInput({ title, description });
  };
  const deleteTodo = (_id) => {
    axios
      .post("http://localhost:4000/delete-todo", { _id })
      .then((res) => {
        console.log(res);
        getAll();
      })
      .catch((err) => console.log(err));
  };
  const markTodo = (_id) => {
    axios
      .post("http://localhost:4000/mark-todo", { _id })
      .then((res) => {
        console.log(res);
        getAll();
      })
      .catch((err) => console.log(err));
  };
  const unmarkTodo = (_id) => {
    axios
      .post("http://localhost:4000/unmark-todo", { _id })
      .then((res) => {
        console.log(res);
        getAll();
      })
      .catch((err) => console.log(err));
  };

  const ascending = () => {
    axios
      .get("http://localhost:4000/ascend-sort")
      .then((res) => {
        console.log(res.data);
        setTodo(res.data);
      })
      .catch((err) => console.log(err));
  };

  const descending = () => {
    axios
      .get("http://localhost:4000/descend-sort")
      .then((res) => {
        console.log(res.data);
        setTodo(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Todo</h1>
      <Progress
        type="circle"
        percent={finalCompletePercent}
        format={(percent) => `${percent}% DONE`}
      />
      <Progress
        type="circle"
        percent={finalRunningPercent}
        format={(percent) => `${percent}% LEFT `}
      />

      <div>
        <form onSubmit={addOrUpdate}>
          <input
            type="text"
            name="title"
            value={input.title}
            onChange={handleChange}
          />
          <br />
          <br />
          <input
            type="text"
            name="description"
            value={input.description}
            onChange={handleChange}
          />
          <br />
          <br />
          <button type="submit">{isUpdate ? "UPDATE" : "ADD"}</button>
        </form>
      </div>
      <div>
        <button onClick={ascending}>ASCENDING</button>
        <button onClick={descending}>DESCENDING</button>
      </div>
      {todo.map((item) => {
        const { _id, title, description } = item;
        return (
          <div className="taskBg" key={_id}>
            <div className={item.status ? "done" : ""}>
              <div className="taskText">Title: {title}</div>
              <div className="taskText">Description: {description}</div>
              <p>
                <button onClick={() => updateTodo(_id, title, description)}>
                  UPDATE
                </button>
              </p>
              <p>
                <button onClick={() => deleteTodo(_id)}>DELETE</button>
              </p>

              <p>
                <button onClick={() => unmarkTodo(_id)}>NOT DONE</button>
              </p>

              <p>
                <button onClick={() => markTodo(_id)}>DONE</button>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Todo;
