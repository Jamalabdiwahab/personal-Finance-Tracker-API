import express from "express";
import { protectedRoute, upload, validate } from "../middlewares/middlewares.js";
import { createUserSchema } from "../schemas/authSchema.js";
import { login, registerNewUser, uploadFile } from "../controllers/authController.js";
const router=express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication endpoints
 */

/**
 * @swagger
*  /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 * 
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success, returns JWT
 * 
 * /auth/profile-pic:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded
 *       400:
 *         description: No file uploaded
 */

router.post('/register',validate(createUserSchema), registerNewUser)
router.post('/login',login)
router.post('/profile-pic',protectedRoute,upload.single('file'), uploadFile)

export default router;