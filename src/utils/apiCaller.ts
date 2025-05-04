import { AxiosResponse } from "axios";
import http from "@/services/httpServices";
import { handleError } from "./handleError";

export async function apiCaller<T, H = object>(
    url: string,
    method: "GET" | "POST",
    data?: unknown,
    signal?: AbortSignal,
    withCredentials: boolean = true,
    showError = true,
    headers?: H
): Promise<T> {
    try {
        let response: AxiosResponse<T>;

        if (method === "GET") {
            response = await http.get(url, {
                params: data,
                signal,
                withCredentials,
                headers: headers || {}
            });
        } else if (method === "POST") {
            response = await http.post(url, data, {
                signal,
                withCredentials,
            });
        } else {
            throw new Error(`Unsupported method: ${method}`);
        }
        return response && response.data;
    } catch (error: unknown) {
        if (showError) {
            throw handleError(error);
        }
    }
}