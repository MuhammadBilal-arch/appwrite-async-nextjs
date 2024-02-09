"use client";
import { useState } from "react";
import { account, ID } from "./appwrite";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useRouter();

  const login = async (email, password) => {
    const session = await account.createEmailSession(email, password);
    setLoggedInUser(await account.get());
    navigate.push("/todo");
    
  };

  const register = async () => {
    await account.create(ID.unique(), email, password, name);
    login(email, password);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <div>
        <p>Logged in as {loggedInUser.name}</p>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }
  const LINK_ON_SUCCESS = "http://localhost:3000/todo";
  const LINK_ON_FAILURE = "http://localhost:3000";
  const onGoogleAuth = () => {
    account.createOAuth2Session("google", LINK_ON_SUCCESS, LINK_ON_FAILURE);
  };

  return (
    <div className="min-h-screen w-full  flex flex-col items-center justify-center">
      <p className="text-xl font-semibold">Not logged in</p>
      <form className="flex flex-col space-y-4 mt-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border border-gray-300 p-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="border border-gray-300 p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          className="border border-gray-300 p-2 rounded"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={() => login(email, password)}
        >
          Login
        </button>
        <div className="text-center">OR</div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={register}
        >
          Register
        </button>
        <div className="text-center">OR</div>
        <button 
        type="button"
        onClick={onGoogleAuth}>Google 0Auth</button>
      </form>
    </div>
  );
};

export default LoginPage;
