import { create } from "zustand";

interface User {
    username: string,
    role: string,
    isLoggedIn: boolean,
    login: (usernmame: string, password: string) => Promise<void>,
    logout: () => void
}

const keyname = 'userstore';
export const useUserStore = create<User>(

    (set) => {

        const storevalue = sessionStorage.getItem(keyname);
        const initialval = storevalue ?
            JSON.parse(storevalue)
            : { username: "", role: "", isLoggedIn: false };
        return {
            ...initialval,
            logout: () => {
                const newstate = { username: "", role: "", isLoggedIn: false }
                sessionStorage.setItem(keyname, JSON.stringify(newstate));
                set(newstate);
            },

            login: async (username: string, password: string) => {
                const roleval = username.toLowerCase().startsWith("x") && password != "" ? "admin" : 'user';
                const newstate = { username: username, role: roleval, isLoggedIn: true };
                sessionStorage.setItem(keyname, JSON.stringify(newstate));
                set(newstate);
            }

        }
    }
);