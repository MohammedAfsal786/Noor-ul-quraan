import User from '../models/User.js';

function todayKey() {
  return new Date().toLocaleDateString('en-CA');
}

export const getTodayPrayer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('prayerHistory');
    const today = todayKey();
    const entry = (user.prayerHistory || []).find(p => p.date === today);
    res.json({
      success: true,
      date: today,
      prayers: entry?.prayers || {
        Fajr: false,
        Dhuhr: false,
        Asr: false,
        Maghrib: false,
        Isha: false
      }
    });
  } catch (err) {
    next(err);
  }
};

export const markPrayer = async (req, res, next) => {
  try {
    const { name } = req.body;
    const valid = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    if (!valid.includes(name)) {
      return res.status(400).json({ success: false, message: 'Invalid prayer name' });
    }

    const today = todayKey();
    const user = await User.findById(req.user.id).select('prayerHistory');
    let history = user.prayerHistory || [];
    let entry = history.find(p => p.date === today);
    if (!entry) {
      entry = {
        date: today,
        prayers: {
          Fajr: false,
          Dhuhr: false,
          Asr: false,
          Maghrib: false,
          Isha: false
        }
      };
      history.push(entry);
    }
    entry.prayers[name] = !entry.prayers[name];
    user.prayerHistory = history;
    await user.save();
    res.json({ success: true, date: today, prayers: entry.prayers });
  } catch (err) {
    next(err);
  }
};

