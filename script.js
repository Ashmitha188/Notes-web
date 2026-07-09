(() => {
  'use strict';

  const STORAGE_KEY = 'desk.notes.v1';

  const els = {
    cardStack: document.getElementById('cardStack'),
    emptyState: document.getElementById('emptyState'),
    noteCount: document.getElementById('noteCount'),
    lastSaved: document.getElementById('lastSaved'),
    searchInput: document.getElementById('searchInput'),
    newNoteBtn: document.getElementById('newNoteBtn'),
    noSelection: document.getElementById('noSelection'),
    editor: document.getElementById('editor'),
    titleInput: document.getElementById('titleInput'),
    bodyInput: document.getElementById('bodyInput'),
    editedAt: document.getElementById('editedAt'),
    deleteBtn: document.getElementById('deleteBtn'),
  };

  let notes = [];
  let activeId = null;
  let saveTimer = null;

  // ---------- persistence ----------

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      notes = raw ? JSON.parse(raw) : [];
    } catch {
      notes = [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      els.lastSaved.textContent = `saved ${formatTime(Date.now())}`;
    } catch {
      els.lastSaved.textContent = 'save failed';
    }
  }

  // ---------- helpers ----------

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return formatTime(ts);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function snippetOf(body) {
    const trimmed = body.trim();
    return trimmed.length ? trimmed : 'No content yet.';
  }

  // ---------- rendering ----------

  function render() {
    const query = els.searchInput.value.trim().toLowerCase();
    const filtered = notes
      .filter(n => {
        if (!query) return true;
        return n.title.toLowerCase().includes(query) || n.body.toLowerCase().includes(query);
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);

    els.noteCount.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;
    els.cardStack.innerHTML = '';

    if (filtered.length === 0) {
      els.emptyState.hidden = false;
      els.emptyState.querySelector('p').textContent = query ? 'No notes match.' : 'The desk is bare.';
    } else {
      els.emptyState.hidden = true;
    }

    for (const note of filtered) {
      const card = document.createElement('div');
      card.className = 'note-card' + (note.id === activeId ? ' active' : '');
      card.tabIndex = 0;
      card.dataset.id = note.id;

      const title = document.createElement('p');
      title.className = 'note-card-title';
      title.textContent = note.title.trim() || 'Untitled note';

      const snippet = document.createElement('p');
      snippet.className = 'note-card-snippet';
      snippet.textContent = snippetOf(note.body);

      const meta = document.createElement('p');
      meta.className = 'note-card-meta';
      meta.textContent = formatDate(note.updatedAt);

      card.append(title, snippet, meta);
      card.addEventListener('click', () => selectNote(note.id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter') selectNote(note.id);
      });

      els.cardStack.appendChild(card);
    }
  }

  function renderEditor() {
    const note = notes.find(n => n.id === activeId);
    if (!note) {
      els.editor.hidden = true;
      els.noSelection.hidden = false;
      return;
    }
    els.editor.hidden = false;
    els.noSelection.hidden = true;
    els.titleInput.value = note.title;
    els.bodyInput.value = note.body;
    els.editedAt.textContent = `edited ${formatDate(note.updatedAt)}`;
  }

  // ---------- actions ----------

  function createNote() {
    const now = Date.now();
    const note = { id: uid(), title: '', body: '', createdAt: now, updatedAt: now };
    notes.unshift(note);
    activeId = note.id;
    persist();
    render();
    renderEditor();
    els.titleInput.focus();
  }

  function selectNote(id) {
    activeId = id;
    render();
    renderEditor();
  }

  function deleteActive() {
    if (!activeId) return;
    const note = notes.find(n => n.id === activeId);
    const label = note && note.title.trim() ? `"${note.title.trim()}"` : 'this note';
    if (!confirm(`Delete ${label}? This can't be undone.`)) return;
    notes = notes.filter(n => n.id !== activeId);
    activeId = null;
    persist();
    render();
    renderEditor();
  }

  function scheduleSave() {
    const note = notes.find(n => n.id === activeId);
    if (!note) return;
    note.title = els.titleInput.value;
    note.body = els.bodyInput.value;
    note.updatedAt = Date.now();

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      persist();
      render();
      els.editedAt.textContent = `edited ${formatDate(note.updatedAt)}`;
    }, 350);
  }

  // ---------- events ----------

  els.newNoteBtn.addEventListener('click', createNote);
  els.deleteBtn.addEventListener('click', deleteActive);
  els.searchInput.addEventListener('input', render);
  els.titleInput.addEventListener('input', scheduleSave);
  els.bodyInput.addEventListener('input', scheduleSave);

  document.addEventListener('keydown', e => {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      els.searchInput.focus();
    }
    if (meta && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      createNote();
    }
  });

  // ---------- init ----------

  loadNotes();
  render();
  renderEditor();
  if (notes.length) {
    els.lastSaved.textContent = `saved ${formatTime(notes[0].updatedAt)}`;
  }
})();
