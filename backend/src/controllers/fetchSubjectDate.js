export const fetchSubjectDate = async(req,res,db)=>{
    try{
        const subjectName = req.params.subjectName;
        const collection = db.collection(subjectName); // Access the collection
        const results = await collection.find({}, { projection: { date: 1, _id: 0 } }).toArray(); // Replace 'dateField' with the actual field name
        
        // Map the results to get an array of date strings
        const dates = results.map(doc => doc.date || ''); // Replace 'dateField' with the actual field name
        res.send(dates); // Return the array of date strings
        
    }catch(error){
        console.error(error)
    }
}