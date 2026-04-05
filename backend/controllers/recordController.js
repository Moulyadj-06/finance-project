import Record from "../models/Record.js";

// CREATE RECORD
export const createRecord = async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    if (!rest.amount || !rest.type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const record = await Record.create({
      ...rest,
      user: userId || req.user._id   
    });

    res.status(201).json(record);

  } catch (error) {
    console.error("CREATE RECORD ERROR:", error); // 🔥 ADD THIS
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// ✅ GET RECORDS (WITH FILTERS)
export const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const { page = 1, limit = 5 } = req.query;

    const records = await Record.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE RECORD
export const deleteRecord = async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE RECORD
export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 ANALYTICS
export const getAnalytics = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((item) => {
      if (item.type === "income") totalIncome += item.amount;
      else totalExpense += item.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🔥 CATEGORY-WISE ANALYTICS
export const getCategoryAnalytics = async (req, res) => {
  try {
    const records = await Record.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🔥 MONTHLY ANALYTICS
export const getMonthlyAnalytics = async (req, res) => {
  try {
    const records = await Record.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 RECENT RECORDS
export const getRecentRecords = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};