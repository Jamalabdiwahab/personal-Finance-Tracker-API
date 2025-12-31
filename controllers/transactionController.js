import User from "../models/AuthModel.js";
import Transactions from "../models/transactionModel.js";

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transactions.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getAllTransactionsBasedOnUser = async (req, res, next) => {
  try {
    const transactions = await Transactions.find({ createdBy: req.user._id });
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedTransaction = await Transactions.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};


export const deleteTransaction = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transactions.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!deletedTransaction)
      return res.status(401).json({ message: "transaction not found" });

    res.json(`transaction with ${id} deleted successfully`);
  } catch (error) {
    next(error);
  }
};

export const getMonthlySummary = async (req, res, next) => {
  try {
    const { month, year } = req.body;

    const now = new Date();

    const m = month ? parseInt(month) - 1 : now.getMonth();
    const y = year ? parseInt(year) : now.getFullYear();

    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const summary = await Transactions.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          totalAmmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          totals: {
            $push: { type: "$_id.type", totalAmmount: "$totalAmmount" },
          },
        },
      },
    ]);

    res.json({
      month: m + 1,
      year: y,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Transactions.find().select("category");

    if (!categories)
      return res.status(400).json({ message: "categories not found" });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
};
export const dashboardOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const topSpendingCategories = await Transactions.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    const totalIncome = await Transactions.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenses = await Transactions.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      topSpendingCategories,
      totalIncome,
      totalExpenses
    });
  } catch (error) {
    next(error);
  }
};

