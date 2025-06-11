const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  // Compose the conversation history
  const messages = [
    {
      role: 'system',
      content: `You are a helpful cleaning service assistant. Your job is to collect the following information from the customer: their name, phone number, home address, and what time they are free for a cleaning appointment. 
      Ask for each piece of information one at a time, confirm each answer before moving to the next, and if the customer has already provided some information, do not ask for it again. If the customer provides all information, confirm the booking details and thank them. 
      If the customer asks a question, answer it politely and then continue collecting the required information.`
    }
  ];
  // Add previous conversation if provided
  if (Array.isArray(history)) {
    messages.push(...history);
  }
  // Add the latest user message
  messages.push({ role: 'user', content: message });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages
      },
      {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your OpenAI API key
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: 'Sorry, there was an error.' });
  }
});

app.listen(3001, () => console.log('Proxy running on port 3001'));