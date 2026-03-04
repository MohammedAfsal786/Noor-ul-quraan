import DhikrRecord from '../models/DhikrRecord.js';
import User from '../models/User.js';

export const saveDhikr = async (req, res, next) => {
  try {
    const { dhikrText, count } = req.body;
    const record = await DhikrRecord.create({
      user: req.user.id,
      dhikrText,
      count
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { dhikrHistory: { dhikrText, count } }
    });
    res.status(201).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

export const getDhikrHistory = async (req, res, next) => {
  try {
    const records = await DhikrRecord.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(100);
    res.json({ success: true, records });
  } catch (err) {
    next(err);
  }
};
