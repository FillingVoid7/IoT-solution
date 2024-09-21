import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateQuizesByDate = async (req, res, db) => {
    try {
        const subjectName = req.query.subjectName;
        console.log("Subject Name:", subjectName);

        const { date } = req.params;
        console.log("Date:", date);

        const collection = await db.collection(subjectName);
        const document = await collection.findOne(
            { date: date },
            { projection: { content: 1, _id: 0 } }
        );

        if (!document) {
            return res.status(404).json({ message: `No content found for this date: ${date}` });
        }

        let quizGenerated = false;
        let oneString = "";

        for (const real of document.content) {
            if (real.image_text) {
                oneString += real.image_text;
            }
        }

        console.log("One String:", oneString);

        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Create and return at least 10 quiz with multiple-choice questions based on the following text. Each question should include the question and an array of 4 options, where each option indicates whether it is correct. Format the output as a JSON array of objects. Here's the text: "${oneString}"`;

        const result = await model.generateContent(prompt);
        const quizContent = await result.response.text();

        console.log("Quiz Generated:", quizContent);

        quizGenerated = true;

        let parsedQuiz;
        try {
            // Clean up and parse the quiz content
            const cleanedQuizContent = quizContent.replace(/```json|```/g, '').trim();
            parsedQuiz = JSON.parse(cleanedQuizContent);
        } catch (parseError) {
            console.error("Error parsing quiz:", parseError);
            return res.status(500).send("Error parsing quiz");
        }

        if (quizGenerated) {
            res.status(200).json(parsedQuiz);
        } else {
            res.status(404).send(`No image text found to generate quiz for date: ${date}`);
        }
    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).send("Internal Server Error");
    }
};
