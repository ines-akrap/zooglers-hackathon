
'use strict';

const express = require('express');
const path = require(`path`);
const https = require('https');
const bodyParser = require('body-parser');
const modules = require('./modules.js');
const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/home.html'));
});

app.post('/submit', async (req, res) => {
  const document = {
    content: req.body.paragraph,
    type: 'PLAIN_TEXT',
  };
  
  const [result] = await client.analyzeEntities({document});
  const [syntax] = await client.analyzeSyntax({document});
  
  const person = modules.getPerson(result.entities);
  const nouns = modules.findNouns(syntax);
  const imageEndpoint = modules.getImageUrl(nouns);
  let image;

  res.send({
    name: person.name,
    salience: person.salience,
    imageEndpoint
  });

  https.get(imageEndpoint, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      image = JSON.parse(data).items[0].link;
      console.log(image);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
