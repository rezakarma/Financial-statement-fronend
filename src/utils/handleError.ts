import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ERROR_OCCURRED } from "@/constants/notifTexts";

interface ErrorResponse {
    message?: string;
}


export const handleError = (error: unknown) => {
    // Check if the error is an AxiosError
    if (axios.isAxiosError(error)) {
        // Narrow the type to AxiosError<ErrorResponse>
        const axiosError = error as AxiosError<ErrorResponse>;

        // Check if the error has a response and a message
        if (axiosError.response?.data?.message) {
            toast.error(axiosError.response.data.message);
        } else if (axiosError.response?.status === 401) {
            // Handle 401 Unauthorized errors
            return;
        } else {
            // Handle other Axios errors
            toast.error(ERROR_OCCURRED);
        }
    } else if (error instanceof Error) {
        // Handle generic JavaScript errors
        toast.error(error.message);
    } else {
        // Handle unknown errors
        toast.error(ERROR_OCCURRED);
    }
};