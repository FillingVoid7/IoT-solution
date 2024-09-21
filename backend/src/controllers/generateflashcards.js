import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export const generateflashcardsByDate = async (req, res, db) => {
    console.log("generateflashcardsByDate");
    try {
        const subjectName = req.query.subjectName; 
        console.log("Subject Name:", subjectName);

        const { date } = req.params;
        console.log("Date:", date);

        const collection = await db.collection(subjectName);

        const document = await collection.findOne({ date: date }, { projection: { content: 1, _id: 0 } });

        if (!document) {
            return res.status(404).json({ message: `No content found for this date: ${date}` });
        }

        let flashcardsGenerated = false;

        for (const real of document.content) {
            if (real.image_text) {
                console.log("Image Text Found:", real.image_text);

                const payload = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "user", content: `Extract key concepts and create flashcards from the following text: "${real.image_text}"` }
                    ]
                };

                const response = await axios.post(OPENAI_URL, payload, {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    }
                });

                const flashcardText = response.data.choices[0].message.content;
                console.log("Flashcard Generated:", flashcardText);

                flashcardsGenerated = true;
            }
        }

        if (flashcardsGenerated) {
            res.status(200).send("Flashcards generated successfully");
        } else {
            res.status(404).send(`No image text found to generate flashcards for date: ${date}`);
        }

    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).send('Internal Server Error');
    }
};
