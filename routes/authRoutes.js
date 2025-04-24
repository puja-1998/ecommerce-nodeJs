const express = require('express');
const { createUser, loginUserCntrl } = require("../controllers/userCntrl")
const router = express.Router();

router.post("/register", createUser );
router.post("/login",  loginUserCntrl);

module.exports = router;