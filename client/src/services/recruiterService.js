import api from "./api";

export const getCandidates = () => {
    return api.get("/recruiter/candidates");
};

export const updateShortlist = (data) => {
    return api.post("/recruiter/shortlist", data);
};

export const getCandidateReports = (candidateId) => {
    return api.get(`/recruiter/candidate/${candidateId}/reports`);
};
