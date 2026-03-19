# Notes Server (Filesystem)

A simple file-based Notes application built with Express and EJS.

This project lets users:
- Create notes from a web form
- Store notes as `.txt` files in a local `files/` directory
- View all notes on the home page
- Open individual notes on a details page

The first line of each `.txt` file is used as the note title. The remaining content is treated as note details.

## Tech Stack

- Node.js
- Express
- EJS
- Native Node.js `fs` module (for filesystem storage)
- Tailwind CSS (via CDN)

## Project Structure

```text
notes-server-filesystem/
├── server.js
├── package.json
├── README.md
├── files/
│   └── *.txt
├── public/
│   ├── images/
│   │   └── favicon.svg
│   ├── javascripts/
│   └── stylesheets/
└── views/
    ├── index.ejs
    └── show.ejs
```

## How It Works

1. Home route (`GET /`) reads all `.txt` files from `files/`.
2. For each file, the first line is extracted as the title.
3. The home page renders all note cards.
4. Submitting the create form (`POST /create`) writes a new `.txt` file.
5. Opening a note route (`GET /file/:filename`) shows title + details.

## Prerequisites

- Node.js 18+ recommended
- npm (comes with Node.js)

Download Node.js: https://nodejs.org/en/download

## Installation and Run (Step-by-Step)

### 1. Clone the repository

```bash
git clone https://github.com/mackcodes/notes-api.git
```

### 2. Move into the project folder

```bash
cd notes-api
```

If your local folder name is different (for example `notes-server-filesystem`), use that folder name instead.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm run start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

The app runs on:

http://localhost:3000

Open that URL in your browser.

## Routes

- `GET /` : render all notes
- `POST /create` : create a new note file
- `GET /file/:filename` : render one note page

## Note Storage Format

Each note file is saved like this:

```text
My Title
Line 1 of note details
Line 2 of note details
```

- Line 1 -> title
- Remaining lines -> note details

## Favicon and Static Assets

Static assets are served from the `public/` folder using Express static middleware.

That means:
- file path: `public/images/favicon.svg`
- browser path: `/images/favicon.svg`

Use this in EJS pages:

```html
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
```

## Common Issues and Fixes

### 1. Favicon not showing

- Confirm file exists at `public/images/favicon.svg`
- Use `/images/favicon.svg` (not `../public/...`)
- Hard refresh browser: `Ctrl + Shift + R`

### 2. Port already in use

If port `3000` is busy, stop the other process or change the port in `server.js`.

### 3. Files are not listed on home page

Only `.txt` files are shown.
Make sure your note files end with `.txt` and are inside `files/`.

### 4. Special characters in title as filename

Current logic removes spaces only. Very special characters may cause file-name issues on some systems.

## Improvements You Can Add

- Add note delete and edit features
- Add validation for empty title/details
- Sanitize title into safe filenames
- Add timestamps (created/updated)
- Add database storage (MongoDB/PostgreSQL) for scale
- Add tests for routes and file operations

## Useful References

- Express docs: https://expressjs.com/
- EJS docs: https://ejs.co/
- Node.js fs docs: https://nodejs.org/api/fs.html

## License

MIT
