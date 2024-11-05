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
	    res.send(`
	        <div style="text-align: center; margin-top: 50px;">
	            <h2>Bonne réponse!</h2>
	            <a href='/'>Question suivante</a>
	        </div>
	    `);
	} else {
	    // Récupération de la documentation Kubernetes en cas de mauvaise réponse
	    const docContent = await axios.get(question.docLink)
	        .then(response => response.data.substring(0, 500)) // Limite de caractères pour l'affichage
	        .catch(() => "Erreur lors de la récupération de la documentation.");
	
	    res.send(`
	        <div style="text-align: center; margin-top: 50px;">
	            <h2>Mauvaise réponse!</h2>
	            <p>${question.question}</p>
	            <p><strong>Réponse correcte:</strong> ${question.reponse}</p>
	            <h3>Explication</h3>
	            <p>${question.explication}</p>
	            <p>${docContent}</p>
	            <a href='/'>Question suivante</a>
	        </div>
	    `);
	}	
});

app.listen(port, () => {
    console.log(`Application de quiz sur Kubernetes en ligne sur http://localhost:${port}`);
});
