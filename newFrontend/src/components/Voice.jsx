import React from 'react';

function Voice({ audioData }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Notes</h1>
      <div className="space-y-4">
        {audioData.map((note, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <div className="flex-1">
              <h2 className="font-semibold">Voice Note {index + 1}</h2>
              <p className="text-gray-600">{note.audio_text}</p>
            </div>
            <audio controls className="ml-4">
              <source src={note.audio_url} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Voice;
