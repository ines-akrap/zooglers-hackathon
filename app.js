
'use strict';

const express = require('express');
const path = require(`path`);
const bodyParser = require('body-parser');
const modules = require('./modules.js');
const language = require('@google-cloud/language');
const axios = require('axios');

// Creates a client
const client = new language.LanguageServiceClient();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

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

  const getImageQuery = async (imageEndpoint) => {
    try {
        return await axios.get(imageEndpoint);
    } catch (error) {
        console.error(error)
    }
  }
  
  const image = getImageQuery(imageEndpoint)
    .then(response => {
      if (response.data) {
        res.send({
          name: person.name,
          salience: person.salience,
          imageEndpoint: response.data.items[0].link
        });
      }
    })
    .catch(error => {
      console.log(error)
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
