import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dua from '../models/Dua.js';

dotenv.config();

const duas = [
  { title: 'Dua for Morning', arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan nushoor', english: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.', category: 'morning_evening', audioUrl: null },
  { title: 'Dua for Evening', arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', transliteration: 'Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal maseer', english: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the return.', category: 'morning_evening', audioUrl: null },
  { title: 'Dua Before Sleep', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: 'Bismika Allahumma amutu wa ahya', english: 'In Your name, O Allah, I die and I live.', category: 'daily', audioUrl: null },
  { title: 'Dua When Waking Up', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', transliteration: 'Alhamdu lillahil ladhi ahyana ba\'da ma amatana wa ilayhin nushoor', english: 'Praise be to Allah who gave us life after death and to Him is the resurrection.', category: 'daily', audioUrl: null },
  { title: 'Dua for Seeking Refuge', arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', transliteration: 'A\'oodhu billahi minash shaytanir rajeem', english: 'I seek refuge in Allah from the accursed Satan.', category: 'quran', audioUrl: null },
  { title: 'Dua for Travel', arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ', transliteration: 'Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrineen wa inna ila Rabbina lamunqaliboon', english: 'Glory to Him who has subjected this to us, and we could never have done it by ourselves. And indeed, to our Lord we will return.', category: 'situations', audioUrl: null },
  { title: 'Dua When Entering Home', arabic: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا', transliteration: 'Bismillahi walajna wa bismillahi kharajna wa ala Rabbina tawakkalna', english: 'In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we rely.', category: 'daily', audioUrl: null },
  { title: 'Dua After Eating', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ', transliteration: 'Alhamdu lillahil ladhi atamana wa saqana wa ja\'alana minal muslimeen', english: 'Praise be to Allah who has fed us and given us drink and made us Muslims.', category: 'daily', audioUrl: null },
  { title: 'Dua Before Eating', arabic: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', english: 'In the name of Allah.', category: 'daily', audioUrl: null },
  { title: 'Dua for Parents', arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', transliteration: 'Rabbi irhamhuma kama rabbayani saghira', english: 'My Lord, have mercy upon them (my parents) as they brought me up when I was small.', category: 'quran', audioUrl: null },
  { title: 'Dua for Forgiveness', arabic: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', transliteration: 'Rabbana zalamna anfusana wa illam taghfir lana wa tarhamna lanakoonanna minal khasireen', english: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.', category: 'quran', audioUrl: null },
  { title: 'Dua in Distress', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', transliteration: 'Hasbunallahu wa ni\'mal wakeel', english: 'Allah is sufficient for us and He is the best Disposer of affairs.', category: 'situations', audioUrl: null }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noor-ul-quran');
  await Dua.deleteMany({});
  await Dua.insertMany(duas);
  console.log('Duas seeded successfully');
  process.exit(0);
}

seed().catch(console.error);
