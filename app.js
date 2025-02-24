const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { email, subject, body } = req.body;
    const sanitizedSubject = subject ? subject.replace(/\n/g, ' ').trim() : 'Scoopable Wax Recipe';
    const sanitizedBody = body ? body.replace(/<[^>]+>/g, '').replace(/\n/g, '\\n').trim() : 'No content provided';

    // **Fix**: Use `printf` to properly format email
    const command = `printf "Subject: ${sanitizedSubject}\\n\\n${sanitizedBody}" | /usr/bin/msmtp --account=default ${email}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.send("Email sent successfully");
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
