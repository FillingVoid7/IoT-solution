import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const summarizeTextsByDate = async (req, res, db) => {
  try {
    
    // Extract subjectName from query parameters and date from req.params
    const subjectName = req.query.subjectName;
    const { date } = req.params;

    console.log("Subject Name:", subjectName);
    console.log("Date:", date);

    // Fetch the document from the subject's collection based on the date
    // const collection = await db.collection(subjectName);
    // const document = await collection.findOne(
    //   { date: date },
    //   { projection: { content: 1, _id: 0 } }
    // );

    // if (!document) {
    //   return res.status(404).json({ message: `No content found for this date: ${date}` });
    // }

    // Combine all image texts into one string
    let oneString = document.content.map(real => real.image_text).join(' ');

    // Generating summary and references
    const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate summarized text
    const summaryPrompt = `Summarize the following text without going outside of this topic, you can summarize in simple words for students related to this content: "${oneString}" You can use md format for better visuals.`;
    const summaryResult = await model.generateContent(summaryPrompt);
    const summarizedText = summaryResult.response.text().trim();

    // Generate academic references (YouTube, articles, etc.)
    const referencePrompt = `Generate a list of 5 academic resources (articles, videos, etc.) for students struggling with the following topic: "${summarizedText}".`;
    const referenceResult = await model.generateContent(referencePrompt);
    const referencesText = referenceResult.response.text().trim();

    // Clean up references and parse them into an array
    const references = referencesText
      .replace(/```json|```/g, '')
      .trim()
      .split('\n')
      .filter(ref => ref);

    // Construct the result object
    const resultObject = {
      summarized: summarizedText,
      references: references,
    };

    // Update the document in the database with the summary and references
    // await collection.updateOne(
    //   { date: date },
    //   { $set: { summary: resultObject } }
    // );

    // Return the summarized content and references to the frontend
    return res.status(200).json({
      message: "Summary and references generated successfully",
      summary: summarizedText,
      references: references
    });

  } catch (error) {
    console.error('Error generating summary and references:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
