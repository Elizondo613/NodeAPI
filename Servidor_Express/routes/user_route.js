const express = require("express");
const router = express.Router();

router
    .get("/authenticate", authenticate)
    .post("/login", login)
    .post("/register", register);

module.exports = router;