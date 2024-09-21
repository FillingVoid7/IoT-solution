export const fetchContentOfSubjectByDate = async (req, res, db) => {
    console.log("fetchContentOfSubjectByDate");
    try {
      const subjectName = req.query.subjectName; 
      console.log("subjectName", subjectName);
  
      const { date } = req.params; 
      console.log("date", date);
      
      const collection = await db.collection(subjectName);
      const content = await collection.findOne({ date: date }, { projection: { content: 1, _id: 0 } });
  
      if (!content) {
        return res.status(404).json({ message: "No content found for this date" });
      }
  
      console.log("content", content);
      res.json(content);
    } catch (e) {
      console.error(e);
      res.status(500).send("An error occurred while fetching content");
    }
  };
  