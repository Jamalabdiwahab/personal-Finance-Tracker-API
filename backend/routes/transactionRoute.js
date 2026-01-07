import express from "express";
import { authorize, protectedRoute } from "../middlewares/middlewares.js";
import { createTransaction, dashboardOverview, deleteTransaction, getAllCategories, getAllTransactionsBasedOnUser, getMonthlySummary, updateTransaction } from "../controllers/transactionController.js";

const router=express.Router();
/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Transaction management endpoints
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Invalid request
 *
 *   get:
 *     summary: Get all transactions of the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */

/**
 * @swagger
 * /transactions/monthlySummary:
 *   post:
 *     summary: Get monthly transaction summary
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 9
 *     responses:
 *       200:
 *         description: Monthly summary
 *       400:
 *         description: Month is required
 */

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Transaction ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Transaction ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 */

/**
 * @swagger
 * /transactions/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /transactions/dashboard:
 *   get:
 *     summary: Admin dashboard
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard message
 */

/**
 * @swagger
 * /transactions/overview:
 *   get:
 *     summary: Admin dashboard overview
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview data
 */


router.post('/',protectedRoute,createTransaction)
router.get('/',protectedRoute, getAllTransactionsBasedOnUser)
router.post('/monthlySummary', protectedRoute, getMonthlySummary)
router.put('/:id',protectedRoute, updateTransaction )
router.delete('/:id', protectedRoute, deleteTransaction)
router.get('/categories',protectedRoute,getAllCategories)
router.get('/dashboard', protectedRoute, authorize('admin'), (req,res)=>{
    res.json({message:`welcome to the admin dashboard, ${req.user.name}`})
})
router.get('/overview',protectedRoute,authorize('admin'),dashboardOverview)
export default router;