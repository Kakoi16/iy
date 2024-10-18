const express = require('express'); // Import express
const path = require('path');
const { aiBtc } = require('./aiBtc'); // Import fungsi aiBtc dari aiBtc.js
const app = express(); // Inisialisasi express
const PORT = 3002; // Tentukan port

// Middleware untuk melayani file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ask', async (req, res) => {
    const userMessage = req.query.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message query parameter is required' });
    }

    try {
        const messages = [
            { role: "system", content: "kamu adalah plana, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
            { role: "assistant", content: "Kamu adalah plana, murid dari sensei blue archive..." },
            { role: "user", content: userMessage },
        ];

        const response = await aiBtc(messages);
        if (response && response.result) { // Ubah dari response.response ke response.result
            res.json({ response: response.result }); // Kirim balasan ke klien
        } else {
            res.json({ error: 'Response tidak ditemukan dari API' }); // Balasan jika respons tidak ditemukan
        }
    } catch (error) {
        console.error('Error handling request:', error.message); // Log error untuk debugging
        res.status(500).json({ error: 'Error processing the request' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
