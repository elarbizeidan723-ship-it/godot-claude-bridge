const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// نقطة الاتصال التي ستكلمها من Godot
app.post('/ask-claude', async (req, res) => {
    const { prompt } = req.body;
    
    try {
        // الاتصال المباشر بـ API الخاص بـ Anthropic Claude
        const response = await fetch('https://anthropic.com', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.CLAUDE_API_KEY, // سنضع المفتاح هنا لاحقاً
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        res.json({ reply: data.content[0].text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
