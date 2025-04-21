
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface FlashcardProps {
  cards: {
    question: string;
    answer: string;
  }[];
}

const FlashcardComponent = ({ cards }: FlashcardProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
        setAnimating(false);
      }, 200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setFlipped(false);
        setAnimating(false);
      }, 200);
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <Button 
          onClick={toggleFlip} 
          variant="ghost" 
          size="sm"
          className="text-xs flex items-center gap-1 text-gray-500 hover:text-edu-purple"
        >
          <RotateCw className="h-3 w-3" />
          {flipped ? 'Show Question' : 'Show Answer'}
        </Button>
      </div>
      
      <Card
        className={`h-64 relative cursor-pointer transition-all duration-300 border border-gray-100 
          ${animating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}
          ${flipped ? "bg-edu-gray/10" : "bg-white"}`}
        onClick={toggleFlip}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className={`transition-all duration-300 transform 
            ${flipped ? "opacity-0 scale-90 rotate-y-180" : "opacity-100 scale-100"}`}>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-edu-purple/10 flex items-center justify-center mb-4">
                <span className="text-edu-purple font-semibold">Q</span>
              </div>
              <p className="text-lg font-medium text-gray-800">{cards[currentIndex].question}</p>
            </div>
          </div>
          <div className={`absolute inset-0 flex items-center justify-center p-6 text-center transition-all duration-300 transform
            ${flipped ? "opacity-100 scale-100" : "opacity-0 scale-90 rotate-y-180"}`}>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-green-600 font-semibold">A</span>
              </div>
              <p className="text-lg font-medium text-gray-800">{cards[currentIndex].answer}</p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between gap-3">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="hover:bg-edu-gray/20 border-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="hover:bg-edu-gray/20 border-gray-200"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardComponent;
