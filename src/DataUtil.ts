import { FieldValues } from "react-hook-form";

const hasErrorMessage = <T>(data: T): data is T & { errorMessage?: string } => {
    return (data as { errorMessage?: string }).errorMessage !== undefined;
};

export function createAPI(baseurl: string, sessionkey: string) {

    async function request<T>(url: string, options: RequestInit): Promise<T> {
        url = baseurl + url;
        const r = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${sessionkey}`
            }
        });
        const data = await r.json();
        console.log(url);
        if (!r.ok) {
            if (r.status == 401) {
                throw new Error("Unauthorized");
            }
            else if (!hasErrorMessage(data) || !data.errorMessage) {
                throw new Error("error calling api");
            }
        }
        return data;
    }

    async function fetchData<T>(url: string): Promise<T> {
        return request(url, {});
    }

    async function deleteData<T>(url: string): Promise<T> {
        return request(url, { method: "DELETE" });
    }
    async function PostData<T>(url: string, form: FieldValues): Promise<T> {
        return request(url, {
            method: "POST",
            body: JSON.stringify(form),
            headers: { "Content-Type": "application/json" }
        });
    };
    return { fetchData, PostData, deleteData }
}
