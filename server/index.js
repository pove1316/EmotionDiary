import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

let records = [];

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: message,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
            }
        });
        const reply = response.data.choices[0].text.trim();
        res.json({ reply: reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});

app.post('/api/tts', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/audio/generate', {
            text: text,
            voice: 'nova' // example voice
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
            }
        });
        const audioUrl = response.data.audio_url;
        res.json({ audioUrl: audioUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate TTS audio' });
    }
});

app.post('/api/records', (req, res) => {
    const { userText, aiText } = req.body;
    const date = new Date();
    const record = {
        date: date.toISOString(),
        userText: userText,
        aiText: aiText,
        audioUrl: 'audio-url' // 실제 오디오 URL
    };
    records.push(record);
    res.json({ success: true });
});

app.get('/api/records', (req, res) => {
    res.json({ records: records });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
