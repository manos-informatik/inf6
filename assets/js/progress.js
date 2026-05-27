const saveProgressBtn = document.getElementById('saveProgressBtn');
const loadProgressBtn = document.getElementById('loadProgressBtn');
const loadProgressFile = document.getElementById('loadProgressFile');
const progressMessage = document.getElementById('progressMessage');

const STORAGE_KEY = 'tc6-progress-v2';
const APP_ID = 'tc6-lernhilfe';

const setProgressMessage = (text, isError = false) => {
  if (!progressMessage) {
    return;
  }

  progressMessage.textContent = text;
  progressMessage.style.color = isError ? '#fda4af' : '#9fbbd7';
};

const getPageKey = () => {
  const bodyKey = document.body?.dataset?.pageKey;
  if (bodyKey && bodyKey.trim()) {
    return bodyKey.trim();
  }

  const path = window.location.pathname.replace(/\\/g, '/');
  const fromPath = path.split('/').filter(Boolean).slice(-2).join('/');
  return fromPath || 'landing';
};

const getCurrentPageState = () => {
  const provider = window.TC6PageState;
  if (!provider || typeof provider.collectProgress !== 'function') {
    return null;
  }

  try {
    const state = provider.collectProgress();
    return state && typeof state === 'object' ? state : null;
  } catch {
    return null;
  }
};

const restoreCurrentPageState = (progress) => {
  const provider = window.TC6PageState;
  if (!provider || typeof provider.restoreProgress !== 'function') {
    return false;
  }

  const pageKey = getPageKey();
  const pageState = progress?.pages?.[pageKey]?.pageState;
  if (!pageState || typeof pageState !== 'object') {
    return false;
  }

  try {
    provider.restoreProgress(pageState);
    return true;
  } catch {
    return false;
  }
};

const normalizeProgress = (raw) => {
  const base = {
    version: 2,
    app: APP_ID,
    savedAt: new Date().toISOString(),
    pages: {}
  };

  if (!raw || typeof raw !== 'object') {
    return base;
  }

  if (raw.pages && typeof raw.pages === 'object') {
    base.pages = raw.pages;
  }

  if (typeof raw.version === 'number') {
    base.version = raw.version;
  }

  if (typeof raw.app === 'string' && raw.app) {
    base.app = raw.app;
  }

  if (typeof raw.savedAt === 'string' && raw.savedAt) {
    base.savedAt = raw.savedAt;
  }

  return base;
};

const readStoredProgress = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return normalizeProgress(null);
  }

  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return normalizeProgress(null);
  }
};

const writeStoredProgress = (progress) => {
  progress.savedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const markCurrentPageVisited = () => {
  const progress = readStoredProgress();
  const pageKey = getPageKey();
  const current = progress.pages[pageKey] || {};
  const pageState = getCurrentPageState();

  progress.pages[pageKey] = {
    ...current,
    visited: true,
    visits: (current.visits || 0) + 1,
    lastVisited: new Date().toISOString()
  };

  if (pageState) {
    progress.pages[pageKey].pageState = pageState;
  }

  writeStoredProgress(progress);
};

const saveCurrentPageState = () => {
  const pageState = getCurrentPageState();
  if (!pageState) {
    return;
  }

  const progress = readStoredProgress();
  const pageKey = getPageKey();
  const current = progress.pages[pageKey] || {};

  progress.pages[pageKey] = {
    ...current,
    visited: true,
    pageState,
    lastSavedState: new Date().toISOString()
  };

  writeStoredProgress(progress);
};

const downloadProgressFile = () => {
  saveCurrentPageState();
  const progress = readStoredProgress();
  const formatted = `${JSON.stringify(progress, null, 2)}\n`;
  const blob = new Blob([formatted], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');

  link.href = url;
  link.download = `tc6-fortschritt-${dateStamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  setProgressMessage('Fortschritt wurde als JSON gespeichert.');
};

const applyLoadedProgress = (loadedData) => {
  const progress = normalizeProgress(loadedData);

  if (!progress.pages || typeof progress.pages !== 'object') {
    throw new Error('Ungültiges JSON-Format.');
  }

  writeStoredProgress(progress);
  markCurrentPageVisited();
  restoreCurrentPageState(progress);
  setProgressMessage('Fortschritt aus JSON geladen.');
};

const setupProgressActions = () => {
  if (saveProgressBtn) {
    saveProgressBtn.addEventListener('click', downloadProgressFile);
  }

  if (loadProgressBtn && loadProgressFile) {
    loadProgressBtn.addEventListener('click', () => {
      loadProgressFile.click();
    });

    loadProgressFile.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      try {
        const content = await file.text();
        const data = JSON.parse(content);
        applyLoadedProgress(data);
      } catch {
        setProgressMessage('Datei konnte nicht geladen werden. Bitte gültige JSON-Datei wählen.', true);
      } finally {
        loadProgressFile.value = '';
      }
    });
  }
};

window.TC6Progress = {
  readStoredProgress,
  writeStoredProgress,
  markCurrentPageVisited,
  saveCurrentPageState,
  restoreCurrentPageState,
  getPageKey
};

markCurrentPageVisited();
setupProgressActions();
