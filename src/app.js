const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId (request, response, next) {
  const { id } = request.params;

  request.app.locals.repositoryIndex = repositories.findIndex(rep => rep.id === id);
  if (request.app.locals.repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = repositories[request.app.locals.repositoryIndex];
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.app.locals.repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like",  (request, response) => {
  const repository = repositories[request.app.locals.repositoryIndex];
  repository.likes++;

  return response.json(repository);
});

module.exports = app;
