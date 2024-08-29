import React from 'react';
import Confetti from 'react-confetti';

const ChapterCompletionPopup = ({ onClose, onCelebrate, chapterName }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
        <p className="text-lg mb-6">You have completed the chapter: <strong>{chapterName}</strong>.</p>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600"
          onClick={() => {
            onCelebrate();
            onClose();
          }}
        >
          Celebrate & Unlock Next Chapter
        </button>
        <Confetti />
      </div>
    </div>
  );
};

export default ChapterCompletionPopup;
