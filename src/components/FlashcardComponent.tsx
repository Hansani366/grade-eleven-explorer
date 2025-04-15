
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashcardProps {
  cards: {
    question: string;
    answer: string;
  }[];
}

const FlashcardComponent = ({ cards }: FlashcardProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-gray-500">
        Card {currentIndex + 1} of {cards.length}
      </div>
      
      <Card
        className={`h-64 relative cursor-pointer transition-all duration-300 ${
          flipped ? "bg-edu-gray/30" : "bg-white"
        }`}
        onClick={toggleFlip}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className={`transition-opacity duration-300 ${flipped ? "opacity-0" : "opacity-100"}`}>
            <h3 className="text-xl font-medium mb-2">Question:</h3>
            <p>{cards[currentIndex].question}</p>
          </div>
          <div className={`absolute inset-0 flex items-center justify-center p-6 text-center transition-opacity duration-300 ${flipped ? "opacity-100" : "opacity-0"}`}>
            <div>
              <h3 className="text-xl font-medium mb-2">Answer:</h3>
              <p>{cards[currentIndex].answer}</p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardComponent;
