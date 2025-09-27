import * as realApi from "./api";
import * as mockApi from "./mockApi";

const useMock = import.meta.env.VITE_USE_MOCK_API === "true";

console.log(`API mode: ${useMock ? "MOCK" : "REAL"}`);

export const apiClient = useMock ? mockApi : realApi;
