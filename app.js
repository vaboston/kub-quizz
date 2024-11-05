const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 3000;

// Charger les questions depuis le fichier JSON
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf-8'));

// Configurer EJS pour le rendu des templates
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Route principale
app.get('/', (req, res) => {
    const question = questions[Math.floor(Math.random() * questions.length)];
    res.render('quiz', { question });
});

// Route pour vérifier la réponse
app.post('/answer', async (req, res) => {
    const { questionText, answer } = req.body;
    const question = questions.find(q => q.question === questionText);


    if (question.reponse === answer) {
            res.render('correct'); 
	} else {
	    res.render('incorrect', {
                question: question.question,
                reponse: question.reponse,
                explication: question.explication,
                docLink: question.docLink
    	    });
	}	
});

app.listen(port, () => {
    console.log(`Application de quiz sur Kubernetes en ligne sur http://localhost:${port}`);
});
