import { create, StoreApi, UseBoundStore } from "zustand";
import { createAPI } from "./DataUtil";

interface User {
    userName: string,
    roleName: string,
    roleRank: number,
    sessionKey: string,
    errorMessage: string,
    isLoggedIn: boolean,
    login: (usernmame: string, password: string) => Promise<void>,
    logout: (username: string) => void
}

async function LoginUser(apiUrl: string, username: string, password: string): Promise<User> {
    apiUrl = apiUrl + "user/";
    const postData = createAPI(apiUrl, "").PostData;
    const user = await postData<User>("login", { username, password });
    return user;
}
async function LogoutUser(apiUrl: string, username: string): Promise<User> {
    apiUrl = apiUrl + "user/";
    const postData = createAPI(apiUrl, "").PostData;
    const user = await postData<User>("logout", { username });
    return user;
}

let userstore: UseBoundStore<StoreApi<User>>;

const keyname = 'userstore';
export function getUserStore(apiUrl: string) {
    if (!userstore) {

        userstore = create<User>(

            (set) => {

                const storevalue = sessionStorage.getItem(keyname);
                const initialval = storevalue ?
                    JSON.parse(storevalue)
                    : { userName: "", roleName: "", roleRank: 0, sessionKey: "", isLoggedIn: false };
                return {
                    ...initialval,
                    logout: async (username: string) => {
                        const user = await LogoutUser(apiUrl, username);
                        const newstate = { userName: user.userName, roleName: user.roleName, roleRank: user.roleRank, sessionKey: user.sessionKey, eroorMessage: user.errorMessage, isLoggedIn: false };
                        sessionStorage.setItem(keyname, JSON.stringify(newstate));
                        set(newstate);
                    },

                    login: async (username: string, password: string) => {
                        const user = await LoginUser(apiUrl, username, password);
                        const loggedin = !user.sessionKey ? false : true;
                        const newstate = { userName: user.userName, roleName: user.roleName, roleRank: user.roleRank, sessionKey: user.sessionKey, eroorMessage: user.errorMessage, isLoggedIn: loggedin };
                        sessionStorage.setItem(keyname, JSON.stringify(newstate));
                        set(newstate);
                    }

                }

            })
    }
    return userstore;
};