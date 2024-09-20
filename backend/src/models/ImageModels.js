import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  date: String,
  images: [String]
});       

const ImageModel = mongoose.model('Image', ImageSchema);

export default ImageModel;
