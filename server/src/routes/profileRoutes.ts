import express from 'express';
import multer from 'multer';
import { updateProfile } from '../controllers/profileController';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

// 画像アップロード用の設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.put('/profile', verifyToken, upload.single('profileImage'), updateProfile);

export default router;
