const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return this.authProvider === "local";
        },
    },
    role: {
        type: String,
        enum: ["candidate", "recruiter"],
        default: "candidate",
    },
    companyName: {
        type: String,
        default: "",
    },
    headline: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    authProvider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local",
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);