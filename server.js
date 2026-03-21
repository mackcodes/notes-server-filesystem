const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public"))); // it points the public folder to the web root(/)

app.get('/', function(req, res){
    fs.readdir('./files', function(err, files){
        const txtFiles = files.filter(file => file.endsWith('.txt'));  // added this line so that only txt file should render(ignoring .gitignore)
        const titles = txtFiles.map(file => {
            const content = fs.readFileSync(`./files/${file}`, "utf-8")
            return content.split('\n')[0];
        });
        res.render("index", {files:txtFiles, titles: titles}); // so instead of {files:files} we use {files:txtFiles}
    });
});

app.get('/file/:filename', function(req, res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        const lines = filedata.split('\n');
        const title =lines[0];   // first line = original title
        const details = lines.slice(1).join('\n');  // details from 2nd line onwards
        res.render('show', {filename: title, filedata:details});
    });
});

app.get('/edit/:filename', function(req, res){
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function(err, data){
        const details = data.split('\n').slice(1).join('\n'); // ← only details needs file reading
        res.render('edit', { 
            filename: req.params.filename, // ← from URL, no file read needed
            details: details               // ← from file content
        });
    });
});

app.post('/edit', function(req, res){
    const newName = req.body.new.replace('.txt', '') + '.txt';
    const newTitle = req.body.new.replace('.txt', ''); // e.g. "newname"
    const updatedContent = `${newTitle}\n${req.body.details}`;  //updates the file 

    fs.rename(`./files/${req.body.previous}`, `./files/${newName}`, function(err){
        fs.writeFile(`./files/${newName}`, updatedContent, function(err){   //updates the file(edits it)
            res.redirect('/');
        });
    });
});

app.post('/create', function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, `${req.body.title}\n${req.body.details}`, function(err){
        res.redirect("/")
    });
})

app.listen(3000);