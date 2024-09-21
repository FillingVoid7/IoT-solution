import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { Flashcard } from "../../models/flashcards.model.js";
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

        let flashcardsGenerated = false;
        let allFlashcards = [];

        let oneString = "";

        for (const real of document.content) {
            if (real.image_text) {
                oneString += real.image_text;
            }
        }


            

                const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
                const prompt = `Create 5 flashcards based on the following text. Each flashcard should have a 'front' (question or prompt) and a 'back' (answer or explanation). Format the output as a JSON array of objects, each with 'front' and 'back' properties. Here's the text: "${real.image_text}"`;

                const result = await model.generateContent(prompt);
                console.log("Full Result:", result); // Log the full result for debugging

                // Invoke the function to get the text
                const responseText = await result.response.text(); // Call the function
                console.log("Response Text:", responseText);

                // Clean up the response text
                const cleanedResponseText = responseText.replace(/```json|```/g, '').trim(); // Remove backticks and 'json'

                // Validate and parse the cleaned response text
                let flashcardsContent;
                try {
                    flashcardsContent = JSON.parse(cleanedResponseText); // Parse the cleaned text
                } catch (parseError) {
                    console.error("Error parsing flashcard content:", parseError);
                    return res.status(500).json({ message: "Error parsing the generated flashcards", error: parseError.message });
                }

                console.log("Flashcards Generated:", flashcardsContent);
                // Map flashcardsContent to match the schema
                const formattedFlashcards = flashcardsContent.map(flashcard => ({
                    question: flashcard.front,
                    answer: flashcard.back
                }));
                
                allFlashcards = allFlashcards.concat(formattedFlashcards);
                flashcardsGenerated = true;
            
        

        if (flashcardsGenerated) {
            // Save the flashcards to your database
            const newFlashcard = new Flashcard({
                flashCard: allFlashcards,
                date: new Date(date), // Ensure the date is a Date object
                subject: subjectName
            });
            await newFlashcard.save(); // Save the new flashcard document
            res.status(200).json({ message: "Flashcards generated successfully", flashcards: allFlashcards });
        } else {
            res.status(404).json({ message: `No image text found to generate flashcards for date: ${date}` });
        }

    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
