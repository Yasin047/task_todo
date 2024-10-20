import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./App.css";
import TodoList from "./mycomponents/TodoList";

const App = () => {
  return (
    <div className="app">
      <TodoList />
    </div>
  );
};

export default App;
