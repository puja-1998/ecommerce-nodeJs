const express = require('express');
const { createUser, loginUserCntrl, getAllUser, getSingleUser } = require("../controllers/userCntrl")
const router = express.Router();

router.post("/register", createUser );
router.post("/login",  loginUserCntrl);
router.get("/all-users", getAllUser);
router.get("/single-user", getSingleUser);

module.exports = router;