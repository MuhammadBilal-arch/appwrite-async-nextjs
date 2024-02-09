"use client";
import React, { useState, useEffect } from "react";
import {
  account,
  database,
  database_id,
  ID,
  todo_collection_id,
} from "../appwrite";
import { Query } from "appwrite";

const Todo = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [todo, setTodo] = useState({
    title: "",
    isCompleted: false,
    description: "",
  });

  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await account.get();
        setLoggedInUser(response);
        setTodo({ ...todo, uid: response.$id });
        onGetTodos(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoggedInUser(null);
      }
    };

    fetchUser();

    const onGetTodos = async (id) => {
      const promise = database.listDocuments(database_id, todo_collection_id, [
        Query.equal("uid", id.$id),
      ]);

      promise.then(
        function (response) {
          console.log(response.documents);
          setTodoList([...todoList, ...response.documents]);
        },
        function (error) {
          console.log(error); // Failure
        }
      );
    };
  }, []);

  const onAddItemTodo = async () => {
    try {
      const result = await database.createDocument(
        database_id,
        todo_collection_id,
        ID.unique(),
        todo
      );
      setTodoList([...todoList, result]);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteItemTodo = async (id) => {
    const result = await database.deleteDocument(
      database_id,
      todo_collection_id,
      id
    );

    setTodoList(todoList.filter((item) => item.$id !== id));
  };

  const onUpdateItemTodo = async (todoItem) => {
    const result = todoList.find((item) => item.$id === todoItem?.$id);
    if (!result) {
      console.error("Todo item not found");
      return;
    }

    try {
      await database.updateDocument(
        database_id,
        todo_collection_id,
        todoItem?.$id,
        {
          title: todo.title,
        }
      );

      const index = todoList.findIndex((item) => item.$id === todoItem?.$id);
      const clone = [ ...todoList ];
      clone[index].title = todo?.title;
       setTodoList(clone);
    } catch (error) {
      console.error("Failed to update todo item:", error);
    }
  };

  return (
    <div className="min-h-screen p-10">
      <div>
        {loggedInUser ? `Welcome, ${loggedInUser.name}` : "Not logged in"}
      </div>

      <div>Todo List</div>

      <div className="w-full flex items-center mt-5">
        <input
          type="text"
          placeholder="Add Todo"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={onAddItemTodo}
        >
          Submit
        </button>
      </div>

      <div className="space-y-2 flex flex-col mt-10">
        {todoList.map((item, index) => {
          return (
            <div
              key={index}
              className="p-2 border flex items-center justify-between  bg-slate-400 text-white border-gray-200 rounded-md "
            >
              <div className="flex flex-col space-y-1">
                <div className="text-sm">{item.title}</div>
                <div className="text-xs">{item.description}</div>
              </div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => onUpdateItemTodo(item)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => onDeleteItemTodo(item.$id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Todo;
