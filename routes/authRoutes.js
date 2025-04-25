const express = require('express');
const { createUser, loginUserCntrl, getAllUser, getSingleUser, deleteUser, updateUser } = require("../controllers/userCntrl")
const router = express.Router();

router.post("/register", createUser );
router.post("/login",  loginUserCntrl);
router.get("/all-users", getAllUser);
router.get("/single-user/:id", getSingleUser);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);


module.exports = router;