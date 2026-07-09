WEBSITE LINK : https://ashmitha188.github.io/Notes-web/
# Desk — a simple notes app

A single-page notes app styled like index cards scattered on a desk. No build tools, no dependencies, no backend — just HTML, CSS, and JavaScript, with notes saved locally in your browser.

## Features

- **Create, edit, delete** notes
- **Live search** across titles and note content
- **Autosave** — changes save automatically as you type (with a short debounce)
- **Persistent storage** — notes are saved to your browser's `localStorage`, so they're still there when you close and reopen the page
- **Keyboard shortcuts**
  - `Ctrl/Cmd + N` — new note
  - `Ctrl/Cmd + K` — jump to search
- Responsive layout that works down to mobile widths

## Getting started

No installation or server required.

1. Download `index.html`, `style.css`, and `script.js` into the same folder.
2. Double-click `index.html` (or open it in your browser).

That's it — you're taking notes.

### Optional: run it via a local server

Opening the file directly works fine for this app, but if you ever add features that need a server (e.g. `fetch` requests), you can serve it locally instead:

```bash
# from inside the project folder
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## File structure

```
notes-app/
├── index.html   # page structure
├── style.css    # visual styling
├── script.js    # note logic (create, edit, delete, search, save)
└── README.md
```

## How data is stored

Notes are stored in your browser's `localStorage` under the key `desk.notes.v1`, as a JSON array of note objects:

```json
{
  "id": "unique-id",
  "title": "Note title",
  "body": "Note content",
  "createdAt": 1737590000000,
  "updatedAt": 1737590400000
}
```

**Notes to keep in mind:**
- Data is local to the specific browser and device you're using — it won't sync across devices.
- Clearing your browser's site data/cache for this page will erase your notes.
- Storage is separate per browser (e.g. notes made in Chrome won't appear in Firefox).

## Customizing

- **Colors and fonts** — all defined as CSS custom properties at the top of `style.css` (under `:root`), so you can re-theme the app by changing a handful of values.
- **Autosave delay** — controlled by the `setTimeout` delay (in milliseconds) inside `scheduleSave()` in `script.js`.

## Browser support

Works in any modern browser (Chrome, Firefox, Safari, Edge). Requires JavaScript and `localStorage` to be enabled.
