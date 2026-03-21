# 📝 Notes App — File System Edition

> A lightweight note-taking web app built with **Node.js**, **Express**, and **EJS** — no database required. Notes are stored as plain `.txt` files on the server.

---

## ✨ Features

- 📄 Create notes from a clean web form
- 💾 Store notes as `.txt` files locally
- 🏠 View all notes on the home page
- 🔍 Open and read individual notes
- ✏️ Edit existing notes (rename + update content)
- 🎨 Clean dark UI with Tailwind CSS

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express | Web framework |
| EJS | Template engine |
| fs module | File system storage |
| Tailwind CSS | Styling (via CDN) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ → [Download here](https://nodejs.org/en/download)
- npm (comes with Node.js)

### 1. Clone the repository
```bash
git clone git@github.com:mackcodes/notes-server-filesystem.git
```

### 2. Move into the project folder
```bash
cd notes-server-filesystem
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the server
```bash
# Production
npm run start

# Development (auto-restart on file changes)
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
notes-server-filesystem/
├── server.js               ← main server file
├── package.json
├── README.md
├── files/
│   └── *.txt               ← notes stored here
├── public/
│   ├── images/
│   │   └── favicon.svg
│   ├── javascripts/
│   └── stylesheets/
└── views/
    ├── index.ejs           ← home page
    ├── edit.ejs            ← edit note form
    └── show.ejs            ← single note page
```

---

## 🔗 Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Render all notes |
| `POST` | `/create` | Create a new note |
| `GET` | `/file/:filename` | Render a single note |
| `GET` | `/edit/:filename` | Render edit form for a note |
| `POST` | `/edit` | Save note edits (rename + content update) |

---

## ✏️ How Editing Works

1. Click **Edit** on a note card from the home page.
2. The app opens `/edit/:filename` and pre-fills:
    - current filename (readonly)
    - editable new filename
    - existing note details
3. On submit, the app:
    - renames the file if the name changed
    - rewrites file content with updated title + details
4. The title is stored on line 1 and details are stored from line 2 onward.

Example update flow:

```
Old file: LearnNode.txt
New file: LearnExpress.txt

Final file content:
LearnExpress
Updated note details...
```

---

## 💾 Note Storage Format

Each note is saved as a `.txt` file like this:

```
My Note Title
This is the first line of details.
This is the second line of details.
```

- **Line 1** → used as the note title
- **Remaining lines** → used as note content

---

## 🧩 About EJS

EJS stands for **Embedded JavaScript**. It is a template engine that lets you write HTML with JavaScript logic inside it. Instead of sending plain HTML, your Express server processes the `.ejs` file, injects dynamic data into it, and then sends the final HTML to the browser.

Think of it like this:

```
Express (data) + EJS (template) = Final HTML sent to browser
```

---

### How EJS fits in this project

```
Browser requests /
        ↓
Express reads all .txt files from /files
        ↓
Passes file list to index.ejs via res.render()
        ↓
EJS loops through files and builds HTML cards
        ↓
Final HTML is sent back to browser
```

In `server.js`:
```javascript
app.get('/', function(req, res) {
    fs.readdir('./files', function(err, files) {
        res.render('index', { files: files, titles: titles });
        //                    ↑ this data is sent to index.ejs
    });
});
```

In `index.ejs`, you receive and use that data:
```ejs
<% files.forEach(function(val, index) { %>
    <h1><%= titles[index] %></h1>
<% }) %>
```

---

### EJS Tags — Full Reference

| Tag | Name | Purpose | Example |
|---|---|---|---|
| `<%= %>` | Output tag | Prints value to HTML (safe, escaped) | `<%= username %>` |
| `<% %>` | Scriptlet tag | Runs JS logic, prints nothing | `<% if(x > 0) { %>` |
| `<%- %>` | Unescaped tag | Prints raw HTML (be careful!) | `<%- htmlContent %>` |
| `<%# %>` | Comment tag | EJS comment, not sent to browser | `<%# this is a note %>` |
| `<%_ %>` | Whitespace tag | Removes whitespace before tag | `<%_ if(x) { %>` |

---

### Output tag `<%= %>`

Used to display a variable value in HTML. EJS automatically escapes special characters to prevent XSS attacks.

```ejs
<h1><%= title %></h1>
<p><%= filedata %></p>
<a href="/file/<%= filename %>">Open</a>
```

---

### Scriptlet tag `<% %>`

Used to write JavaScript logic — `if`, `for`, `forEach`, etc. Does not print anything to HTML on its own.

```ejs
<% if (files.length > 0) { %>
    <p>You have notes!</p>
<% } else { %>
    <p>No notes yet.</p>
<% } %>
```

```ejs
<% files.forEach(function(file, index) { %>
    <div>
        <h2><%= titles[index] %></h2>
    </div>
<% }) %>
```

---

### Unescaped tag `<%- %>`

Prints raw HTML directly. Use carefully — never use with user input as it can cause security issues.

```ejs
<%- '<strong>bold text</strong>' %>
```

---

### EJS in this project — real examples

**`index.ejs`** — loop through notes and render cards:
```ejs
<% if(files.length > 0){ %>
    <% files.forEach(function(val, index){ %>
        <div class="task bg-zinc-800 rounded-md p-4">
            <h1><%= titles[index] %></h1>
            <a href="/file/<%= val %>">Read more</a>
        </div>
    <% }) %>
<% } else { %>
    <h3>No tasks yet</h3>
<% } %>
```

**`show.ejs`** — display a single note:
```ejs
<h1><%= filename %></h1>
<pre><%= filedata %></pre>
```

---

### Setting up EJS in Express

```javascript
app.set("view engine", "ejs");  // tell Express to use EJS
```

```javascript
res.render("index", { files: files, titles: titles });
//          ↑ file name inside views/    ↑ data passed to template
```

EJS automatically looks inside the `views/` folder — no need to write the full path or `.ejs` extension.

---

## 🖼 Static Assets & Favicon

Static files are served from the `public/` folder.

```javascript
app.use(express.static(path.join(__dirname, "public")));
```

| File path | Browser path |
|---|---|
| `public/images/favicon.svg` | `/images/favicon.svg` |

Add favicon in your EJS files:
```html
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
```

---

## 🐛 Common Issues & Fixes

### Favicon not showing
- Confirm file exists at `public/images/favicon.svg`
- Use `/images/favicon.svg` (not `../public/...`)
- Hard refresh: `Ctrl + Shift + R`

### Port already in use
```bash
# Find and kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

### Files not listed on home page
- Make sure files end with `.txt`
- Make sure files are inside the `files/` folder

---

## 🔮 Future Improvements

- [ ] Add note delete feature
- [ ] Add validation for empty title/details
- [ ] Sanitize title into safe filenames
- [ ] Add timestamps (created/updated)
- [ ] Migrate to database storage (MongoDB/PostgreSQL)
- [ ] Add tests for routes and file operations

---

## 📚 Useful References

- [Express Docs](https://expressjs.com/)
- [EJS Docs](https://ejs.co/)
- [Node.js fs Docs](https://nodejs.org/api/fs.html)

---

## 📄 License

MIT © 2026

---

