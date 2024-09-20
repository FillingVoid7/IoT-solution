import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fetchImagesByDateAndConvertToPDF = async (req, res, db) => {
  const { date } = req.params;

  try {
    // Get all collection names dynamically
    const collections = await db.listCollections().toArray();

    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, `output_${date}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream); // Write the PDF to a file

    let textFound = false; // Flag to check if any images are found

    // Iterate through each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);

      // Fetch documents matching the date in this collection
      const documents = await collection.find({ date: date }).project({ _id: 0, content: 1 }).toArray();

      if (documents && documents.length > 0) {
        textFound = true; // Set flag if any images are found

        for (const document of documents) {
          console.log(document);
          document.content.map((real) => {
            doc.fontSize(15).text(real.text);
          });
        }
      }
    }

    // Finalize the PDF
    doc.end();

    // Handle the case where no images are found
    writeStream.on('finish', () => {
      if (textFound) {
        res.status(200).json({ message: 'PDF created successfully', pdfPath });
      } else {
        res.status(404).json({ message: 'No texts found for the given date' });
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
