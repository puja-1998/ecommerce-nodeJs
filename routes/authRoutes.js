const express = require('express');
const { createUser, loginUserCntrl, getAllUser, getSingleUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken } = require("../controllers/userCntrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", createUser );
router.post("/login",  loginUserCntrl);
router.get("/all-users", getAllUser);
router.get("/single-user/:id",authMiddleware, isAdmin, getSingleUser);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser",authMiddleware, updateUser);
router.put("/block-user/:id",authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware, isAdmin, unblockUser);
router.get("/refresh", handleRefreshToken);

module.exports = router;