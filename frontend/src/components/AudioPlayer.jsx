import { useAudio } from '../context/AudioContext';

export default function AudioPlayer() {
  const { playing, currentAyah, pause, resume, stop, RECITERS, reciter, setReciter } = useAudio();
  if (!currentAyah) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-islamic-green dark:bg-islamic-green-dark text-white p-4 shadow-2xl z-40">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={playing ? pause : resume} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-xl">
            {playing ? '⏸' : '▶'}
          </button>
          <button onClick={stop} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-sm">
            ⏹
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm opacity-90">
            Playing: Surah {currentAyah.surahNum}, Ayah {currentAyah.ayahNum}
          </p>
        </div>
        <select
          value={reciter.id}
          onChange={e => setReciter(RECITERS.find(r => r.id === e.target.value))}
          className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm"
        >
          {RECITERS.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
