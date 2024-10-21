"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const profileController_1 = require("../Controllers/profileController");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = express_1.default.Router();
// 画像アップロード用の設定
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.put('/profile', verifyToken_1.verifyToken, upload.single('profileImage'), profileController_1.updateProfile);
exports.default = router;
