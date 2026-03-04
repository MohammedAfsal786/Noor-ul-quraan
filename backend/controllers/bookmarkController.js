import User from '../models/User.js';

export const getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('bookmarks');
    res.json({ success: true, bookmarks: user.bookmarks || [] });
  } catch (err) {
    next(err);
  }
};

export const addBookmark = async (req, res, next) => {
  try {
    const { surahNumber, ayahNumber, surahName } = req.body;
    const user = await User.findById(req.user.id);
    const exists = user.bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
    if (exists) return res.json({ success: true, message: 'Already bookmarked' });

    user.bookmarks.push({ surahNumber, ayahNumber, surahName });
    await user.save();
    res.status(201).json({ success: true, bookmarks: user.bookmarks });
  } catch (err) {
    next(err);
  }
};

export const removeBookmark = async (req, res, next) => {
  try {
    const { surahNumber, ayahNumber } = req.params;
    const user = await User.findById(req.user.id);
    user.bookmarks = user.bookmarks.filter(b => !(b.surahNumber == surahNumber && b.ayahNumber == ayahNumber));
    await user.save();
    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (err) {
    next(err);
  }
};
