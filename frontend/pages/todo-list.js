import styles from "../styles/todo-list.module.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import ToDo from "../components/todo";

export default function ToDoList() {
  const [todos, setTodos] = useState([]);
  const [mainInput, setMainInput] = useState("");
  const [filter, setFilter] = useState();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true;
      fetchTodos();
    }
    console.log("todos:", todos);
  }, [todos]);

  async function fetchTodos(completed) {
    try {
      let path = "/api/todos";
      if (completed !== undefined) {
        path = `/api/todos?completed=${completed}`;
      }
      const res = await fetch(path);
      if (!res.ok) {
        console.error("Failed to fetch todos:", res.status, await res.text());
        setTodos([]);
        return;
      }
      const json = await res.json();
      setTodos(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error("Error fetching todos:", e);
      setTodos([]);
    }
  }

  const debouncedUpdateTodo = useCallback(debounce(updateTodo, 500), []);

  function handleToDoChange(e, id) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const copy = [...todos];
    const idx = todos.findIndex((todo) => todo.id === id);
    const changedToDo = {
      ...todos[idx],
      [name]: value,
    };
    copy[idx] = changedToDo;
    debouncedUpdateTodo(changedToDo);
    setTodos(copy);
    console.log("todos:", todos);
  }

  async function updateTodo(todo) {
    const data = {
      name: todo.name,
      completed: todo.completed,
    };
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("todos:", todos);
  }

  async function addToDo(name) {
    const res = await fetch(`/api/todos`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        completed: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const json = await res.json();
      const copy = [...todos, json];
      setTodos(copy);
    }
  }

  async function handleDeleteToDo(id) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const idx = todos.findIndex((todo) => todo.id === id);
      const copy = [...todos];
      copy.splice(idx, 1);
      setTodos(copy);
    }
  }

  function handleMainInputChange(e) {
    setMainInput(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      if (mainInput.length > 0) {
        addToDo(mainInput);
        setMainInput("");
      }
    }
  }

  function handleFilterChange(value) {
    setFilter(value);
    fetchTodos(value);
  }

  return (
    <div className={`${styles.container} blog-post`}>
      <div className={styles.mainInputContainer}>
        <input
          className={styles.mainInput}
          placeholder="What needs to be done?"
          value={mainInput}
          onChange={(e) => handleMainInputChange(e)}
          onKeyDown={handleKeyDown}
        ></input>
      </div>
      {!todos && <div className={styles.loading}>Loading...</div>}
      {todos && (
        <div className={styles.todoList}>
          {todos.map((todo) => {
            return (
              <ToDo
                key={todo.id}
                todo={todo}
                onDelete={handleDeleteToDo}
                onChange={handleToDoChange}
              />
            );
          })}
        </div>
      )}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${
            filter === undefined && styles.filterActive
          }`}
          onClick={() => handleFilterChange()}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${
            filter === false && styles.filterActive
          }`}
          onClick={() => handleFilterChange(false)}
        >
          Active
        </button>
        <button
          className={`${styles.filterBtn} ${
            filter === true && styles.filterActive
          }`}
          onClick={() => handleFilterChange(true)}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
