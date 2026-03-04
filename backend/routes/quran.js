import express from 'express';

const router = express.Router();
const BASE = 'https://api.alquran.cloud/v1';

router.get('/surah/:number', async (req, res, next) => {
  try {
    const { number } = req.params;
    const [ar, en] = await Promise.all([
      fetch(`${BASE}/surah/${number}`).then(r => r.json()),
      fetch(`${BASE}/surah/${number}/en.sahih`).then(r => r.json())
    ]);
    const sData = ar.data;
    const eData = en.data;
    if (!sData || !eData) return res.status(404).json({ success: false });
    const ayahs = sData.ayahs.map((a, i) => ({
      number: a.number,
      numberInSurah: a.numberInSurah,
      text: a.text,
      english: eData.ayahs[i]?.text || '',
      juz: a.juz
    }));
    res.json({ success: true, surah: { ...sData, ayahs } });
  } catch (err) {
    next(err);
  }
});

router.get('/meta', async (req, res, next) => {
  try {
    const r = await fetch(`${BASE}/meta`);
    const data = await r.json();
    const surahs = data.data?.surahs?.references || [];
    res.json({ success: true, surahs });
  } catch (err) {
    next(err);
  }
});

const RECITERS_AUDIO = {
  alafasy: 'ar.alafasy',
  sudais: 'ar.abdulbasitmurattal'
};

router.get('/audio/:surah/:ayah', async (req, res, next) => {
  try {
    const { surah, ayah } = req.params;
    const reciter = req.query.reciter || 'alafasy';
    const edition = RECITERS_AUDIO[reciter] || RECITERS_AUDIO.alafasy;
    const r = await fetch(`${BASE}/ayah/${surah}:${ayah}/${edition}`);
    const data = await r.json();
    const url = data.data?.audio || data.data?.audioSecondary?.[0];
    if (!url) return res.status(404).json({ success: false, message: 'Audio not found' });
    res.json({ success: true, data: { url } });
  } catch (err) {
    next(err);
  }
});

export default router;
