import type{ HairFact } from "../types/hair-fact";

    interface ProductFact {
      answer: string;
      facts: HairFact[];
    }

export const PRODUCT_CHECK_FACTS: ProductFact[] = [
  {
    answer: "Always",
    facts: [
      {
        fact: "Only 12% of 'natural' hair products are truly free from harsh chemicals",
        description: "Your ingredient awareness puts you ahead of 88% of consumers. We'll help you spot even the hidden harmful ingredients.",
        source: "Clean Beauty Database",
        year: 2023
      }
    ]
  },
  {
    answer: "Sometimes",
    facts: [
      {
        fact: "Many 'natural' hair products still contain harmful ingredients like sulfates and drying alcohols",
        description: "We'll help you identify which ingredients to avoid and which to embrace.",
        source: "Journal of Cosmetic Science",
        year: 2023
      }
    ]
  },
  {
    answer: "Never",
    facts: [
      {
        fact: "65% of hair damage is linked to using products with harmful ingredients",
        description: "Don't worry - we'll teach you the basics of ingredient checking to protect your hair.",
        source: "Hair Care Research Institute",
        year: 2023
      }
    ]
  },
  {
    answer: "What do I even look for?",
    facts: [
      {
        fact: "The first 5 ingredients make up about 80% of any hair product",
        description: "We'll show you exactly what to look for and what to avoid in your products.",
        source: "Cosmetic Formulation Guide",
        year: 2023
      }
    ]
  }
];

export function getProductCheckFact(answer: string): HairFact {
  const answerFacts = PRODUCT_CHECK_FACTS.find(item => item.answer === answer)?.facts || [];
  const randomIndex = Math.floor(Math.random() * answerFacts.length);
  return answerFacts[randomIndex];
} 