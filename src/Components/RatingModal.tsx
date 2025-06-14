import { useState } from "react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: (rating: number) => void;
  driverName?: string; 
  onSkip: () => void; 
}

export const RatingModal = ({
  isOpen,
  onClose,
  onSubmitRating,
  driverName,
  onSkip,
}: RatingModalProps) => {
  const [rating, setRating] = useState(0); 

  if (!isOpen) {
    return null; 
  }

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting."); 
      return;
    }
    onSubmitRating(rating);
    onClose(); 
    setRating(0); 
  };

  const handleSkip = () => {
    onSkip(); 
    onClose(); 
    setRating(0); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto transform transition-all scale-100 opacity-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Rate Your Ride with {driverName || "Driver"}!
        </h3>
        <p className="text-gray-700 text-center mb-6">
          How was your experience? Your feedback helps us improve.
        </p>

        <div className="flex justify-center items-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <svg
              key={starValue}
              className={`w-10 h-10 cursor-pointer transition-colors duration-200 ${
                starValue <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => handleStarClick(starValue)}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
            </svg>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
            onClick={handleSkip}
          >
            Skip
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
            onClick={handleSubmit}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};
