import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65c5f18e1a81f20d914b");

export const account = new Account(client);
export { ID } from "appwrite";

export const database = new Databases(client)

export const database_id = '65c6178e03ae0111aab5'
export const todo_collection_id = '65c62aba1ebb9b0848ed'