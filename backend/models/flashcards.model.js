import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
   flashCard: [
    {
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }
   ],
   date: { type: Date, required: true },
    subject: { type: String, required: true },
}, {
    timestamps: true,}
);

export const Flashcard = mongoose.model('Flashcard', flashcardSchema);
