import { isAxiosError } from "axios";
import api from "../lib/axios";

export async function queryIA(userMessage: string) {
    try {
        const url = "/ia/query"
        const {data} = await api.post(url, {
            query: userMessage
        })
        console.log(data)
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error)
            throw new Error(error.response.data.error);
        }
    }
}