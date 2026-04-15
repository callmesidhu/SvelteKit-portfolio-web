import { writable } from "svelte/store";
import { auth } from "./firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export const user = writable<User | null>(null);

onAuthStateChanged(auth, (u) => {
  user.set(u);
});
