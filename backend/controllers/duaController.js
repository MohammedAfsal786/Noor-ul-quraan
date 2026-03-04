import Dua from '../models/Dua.js';

export const getDuas = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const duas = await Dua.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, duas });
  } catch (err) {
    next(err);
  }
};
