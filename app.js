const express = require("express");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const postBank = require("./postBank")

const app = express();

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, "public")));

const posts = postBank.list();

app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
  ).join('')}
    </div>
  </body>
</html>`;

  res.send(html);
});

app.get('/posts/:id', (req, res, next) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if (!post.id) {
    throw new Error('Not Found');
  } else {
    const htmlSinglePost = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class='single-post'>
          <p>
            Title: ${post.title}
            Author: ${post.name}
            Date: ${post.date}
            Content: ${post.content}
          </p>
        </div>
    </div>
  </body>
</html>`;

    res.send(htmlSinglePost);
  }
});

const {PORT} = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
