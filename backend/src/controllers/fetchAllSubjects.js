export const fetchAllSubjects = async (req, res, db) => {
    try {
      const collections = await db.listCollections().toArray();
      const subjectList = collections.map(collection => collection.name);

      console.log(subjectList)
  
      res.status(200).json(subjectList);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  