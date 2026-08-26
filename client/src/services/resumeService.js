import api from "./api";

export const uploadResume = (formData) => {
    return api.post("/resume/resume", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getCurrentResume = () => {
    return api.get("/resume/current");
};

export const updateSkills = (skills) => {
    return api.put("/resume/skills", { skills });
};