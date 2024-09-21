import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import connectDB from "../../dbConnect.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateFlashcardsByDate = async (req, res, db) => {
    try {
        await connectDB();
        const subjectName = req.query.subjectName;
        console.log("Subject Name:", subjectName);

        const { date } = req.params;
        console.log("Date:", date);

        const collections = await db.collection(subjectName);
        const document = await collections.findOne({ date: date }, { projection: { content: 1, _id: 0 } });

        if (!document) {
            return res.status(404).json({ message: `No content found for this date: ${date}` });
        }

        let oneString = "";

        for (const real of document.content) {
            if (real.image_text) {
                oneString += real.image_text;
            }
        }

        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Create 5 flashcards based on the following text. Each flashcard should have a 'front' (question) and a 'back' (answer). Format the output as a JSON array of objects, each with 'front' and 'back' properties. Here's the text so based on this text you can also generate relavant flashcard contents "${oneString}"`;

        const result = await model.generateContent(prompt);
        console.log("Full Result:", result); // Log the full result for debugging

        // Get the response text
        const responseText = await result.response.text(); 
        console.log("Response Text:", responseText);

        // Clean up the response text
        const cleanedResponseText = responseText.replace(/```json|```/g, '').trim();

        // Validate and parse the cleaned response text
        let flashcardsContent;
        try {
            flashcardsContent = JSON.parse(cleanedResponseText); // Parse the cleaned text
        } catch (parseError) {
            console.error("Error parsing flashcard content:", parseError);
            return res.status(500).json({ message: "Error parsing the generated flashcards", error: parseError.message });
        }

        console.log("Flashcards Generated:", flashcardsContent);
        
        // Ensure the output format is correct
        const formattedFlashcards = flashcardsContent.map(flashcard => ({
            front: flashcard.front,
            back: flashcard.back
        }));

        return res.status(200).json({ message: "Flashcards generated successfully", flashcards: formattedFlashcards });

    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
