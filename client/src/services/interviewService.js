import api from "./api";

export const getQuestions = (config = {}) => {
    return api.post("/interview/questions", config);
};

export const startInterview = (config = {}) => {
    return api.post("/interview/start", config);
};

export const executeCode = (data) => {
    return api.post("/interview/execute-code", data);
};

export const analyzeComplexity = (data) => {
    return api.post("/interview/analyze-complexity", data);
};

export const getHint = (data) => {
    return api.post("/interview/hint", data);
};

export const submitAnswer = (data) => {
    return api.post("/interview/answer", data);
};

export const endInterview = (sessionId) => {
    return api.post(`/interview/end/${sessionId}`);
};

export const getReport = (sessionId) => {
    return api.get(`/interview/report/${sessionId}`);
};

export const getHistory = () => {
    return api.get("/interview/history");
};

export const deleteInterviewSession = (sessionId) => {
    return api.delete(`/interview/session/${sessionId}`);
};