import type { LiveExpression } from 'mesh-avatar';

interface Messages {
  expressions: Record<LiveExpression, string>;
  mouthStyle: string;
  mouthStyleHint: string;
  customMouthStyle: string;
  mouthStyles: Record<'calm' | 'default' | 'lively' | 'subtle' | 'big', string>;
  pointerHint: string;
  expressionHint: string;
  loading: string;
  loadFailed: string;
  copy: string;
  copied: string;
  copySucceeded: string;
  copyFailed: string;
}

const messages: Record<'en' | 'ja' | 'zh', Messages> = {
  en: {
    expressions: {
      neutral: 'Neutral', smile: 'Smile', shy: 'Shy', surprise: 'Surprise',
      halfLidded: 'Half-lidded', angry: 'Angry', sad: 'Sad', wink: 'Wink',
    },
    mouthStyle: 'Mouth style',
    mouthStyleHint: 'Choose a style, then animate the text below to compare.',
    customMouthStyle: 'Custom',
    mouthStyles: { calm: 'Relaxed', default: 'Standard', lively: 'Snappy', subtle: 'Subtle', big: 'Expressive' },
    pointerHint: 'Move your pointer and she turns to face it.',
    expressionHint: 'Pick an expression to try it.',
    loading: 'Loading the live preview…',
    loadFailed: 'The live preview couldn’t load. Try reloading in a browser with WebGL enabled. You can still explore the project on GitHub or npm.',
    copy: 'Copy',
    copied: 'Copied',
    copySucceeded: 'Copied to clipboard.',
    copyFailed: 'Copy wasn’t available. The code is selected; use your browser’s copy command.',
  },
  ja: {
    expressions: {
      neutral: '通常', smile: '笑顔', shy: '照れ', surprise: '驚き',
      halfLidded: '半目', angry: '怒り', sad: '悲しみ', wink: 'ウインク',
    },
    mouthStyle: '口の動きのタイプ',
    mouthStyleHint: 'タイプを選んで、下の文章で口の動きを試せます。',
    customMouthStyle: 'カスタム',
    mouthStyles: { calm: 'ゆったり', default: '標準', lively: 'キビキビ', subtle: '控えめ', big: 'はっきり' },
    pointerHint: 'ポインターを動かすと、その方向へ顔を向けます。',
    expressionHint: 'ボタンで表情を切り替えられます。',
    loading: 'プレビューを読み込んでいます…',
    loadFailed: 'プレビューを読み込めませんでした。WebGL が使えるブラウザで再読み込みしてください。プロジェクトの詳細は GitHub や npm でも確認できます。',
    copy: 'コピー',
    copied: 'コピー済み',
    copySucceeded: 'クリップボードにコピーしました。',
    copyFailed: 'コピーできませんでした。コードを選択したので、ブラウザのコピー操作を使ってください。',
  },
  zh: {
    expressions: {
      neutral: '平静', smile: '微笑', shy: '害羞', surprise: '惊讶',
      halfLidded: '半睁眼', angry: '生气', sad: '难过', wink: '眨眼',
    },
    mouthStyle: '口型风格',
    mouthStyleHint: '选择一种风格，再用下方文字试试口型动画。',
    customMouthStyle: '自定义',
    mouthStyles: { calm: '舒缓', default: '标准', lively: '轻快', subtle: '柔和', big: '夸张' },
    pointerHint: '移动指针，她会转向指针的方向。',
    expressionHint: '选一个表情试试看。',
    loading: '正在加载实时预览…',
    loadFailed: '实时预览加载失败。请在支持 WebGL 的浏览器中重新加载。你仍可以在 GitHub 或 npm 上了解这个项目。',
    copy: '复制',
    copied: '已复制',
    copySucceeded: '已复制到剪贴板。',
    copyFailed: '无法使用复制功能。代码已选中，请使用浏览器的复制命令。',
  },
};

const lang = document.documentElement.lang.split('-')[0];
export const language = lang === 'ja' ? 'ja' : lang === 'zh' ? 'zh' : 'en';
export const copy = messages[language];
