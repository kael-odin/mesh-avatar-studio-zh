import { createRoot } from 'react-dom/client';
import '../../../src/live/live.css';
import './player.css';
import { PlayerApp } from './PlayerApp';

const lang = document.documentElement.lang.split('-')[0];
const language = lang === 'ja' ? 'ja' : lang === 'zh' ? 'zh' : 'en';
createRoot(document.getElementById('root')!).render(<PlayerApp language={language} />);
