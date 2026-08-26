const express = require("express");
const router = express.Router();
const { registerUser, loginUser, socialLogin } = require("../controllers/authContoller.js");

router.get("/test", (req, res) => {
    res.send("auth working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/social", socialLogin);

module.exports = router;