"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const progressController_1 = require("../Controllers/progressController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// 進捗の更新
router.post('/update', authMiddleware_1.isAuthenticated, [
    (0, express_validator_1.body)('articleSlug').isString(),
    (0, express_validator_1.body)('sectionId').isInt(),
    (0, express_validator_1.body)('status').isIn(['understood', 'review']),
], progressController_1.updateProgress);
// 全体の進捗を取得
router.get('/', authMiddleware_1.isAuthenticated, progressController_1.getProgress);
// 特定のセクションの進捗を取得
router.get('/status', authMiddleware_1.isAuthenticated, progressController_1.getSectionProgress);
exports.default = router;
