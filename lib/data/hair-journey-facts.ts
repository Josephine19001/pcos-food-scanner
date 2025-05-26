import type{ HairFact } from "../types/hair-fact";

interface JourneyFacts {
  answer: string;
  facts: HairFact[];
}

export const HAIR_JOURNEY_FACTS: JourneyFacts[] = [
  {
    answer: "Breakage",
    facts: [
      {
        fact: "Hair breakage is usually a moisture issue, not just a strength one",
        description: "We'll teach you how to balance both moisture and protein for stronger hair.",
        source: "Journal of Cosmetic Science",
        year: 2022
      },
      {
        fact: "90% of hair breakage occurs during manipulation, not natural shedding",
        description: "Learn gentle handling techniques to minimize breakage.",
        source: "Cosmetic Dermatology Review",
        year: 2023
      }
    ]
  },
  {
    answer: "Growth",
    facts: [
      {
        fact: "Hair grows an average of 0.5 inches per month when properly maintained",
        description: "We'll help you track and maximize your growth potential.",
        source: "American Academy of Dermatology",
        year: 2023
      }
    ]
  },
  {
    answer: "Finding the right products",
    facts: [
      {
        fact: "The average natural hair journey involves trying 8-12 different product lines",
        description: "We'll help you find your perfect products faster.",
        source: "Natural Hair Product Survey",
        year: 2023
      }
    ]
  },
  {
    answer: "Dryness & moisture",
    facts: [
      {
        fact: "75% of natural hair issues stem from improper moisture balance",
        description: "Learn how to properly moisturize and seal your hair.",
        source: "Textured Hair Care Study",
        year: 2023
      }
    ]
  },
  {
    answer: "Styling consistently",
    facts: [
      {
        fact: "Consistent styling routines can reduce breakage by up to 60%",
        description: "We'll help you develop a sustainable styling routine.",
        source: "Hair Care Practices Study",
        year: 2023
      }
    ]
  }
];

export function getJourneyFact(answer: string): HairFact {
  const answerFacts = HAIR_JOURNEY_FACTS.find(item => item.answer === answer)?.facts || [];
  const randomIndex = Math.floor(Math.random() * answerFacts.length);
  return answerFacts[randomIndex];
} 