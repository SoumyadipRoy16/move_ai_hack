"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval: any;

type Card = {
  id: number;
  icon: React.ReactNode; // Icon for the card
  content: React.ReactNode; // Content for the card
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
  autoFlipInterval,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  autoFlipInterval?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const AUTO_FLIP_INTERVAL = autoFlipInterval || 5000;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, AUTO_FLIP_INTERVAL);
  };

  const handleCardClick = (index: number) => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      const clickedCard = newArray.splice(index, 1)[0];
      newArray.unshift(clickedCard);
      return newArray;
    });
  };

  return (
    <div className="relative h-80 w-100 md:h-80 md:w-120">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute dark:bg-black bg-white h-80 w-80 md:h-80 md:w-200 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-center items-center text-center cursor-pointer"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, // decrease z-index for the cards that are behind
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            onClick={() => handleCardClick(index)}
          >
            {/* Icon */}
            <div className="mb-4">{card.icon}</div>
            {/* Content */}
            <div className="font-normal text-neutral-700 dark:text-neutral-200">
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};