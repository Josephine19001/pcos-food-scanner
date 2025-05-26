import type { HairFact } from '../types/hair-fact';

export const hairFacts: HairFact[] = [
  {
    fact: 'Over 70% of Black women say they were never taught how to care for their natural hair',
    description:
      'Many Black women are learning proper hair care techniques for the first time as adults.',
    source: 'Mintel Black Haircare Consumer Report',
    year: 2021,
  },
  {
    fact: '65% of Black women have considered giving up on their natural hair journey due to lack of proper guidance',
    description:
      'The journey to natural hair can be overwhelming without proper education and support.',
    source: "TextureMedia's Natural Hair Consumer Insights Study",
    year: 2020,
  },
  {
    fact: '77% of Black women report feeling pressure to straighten their hair for work',
    description:
      'Professional environments often create implicit bias against natural hair textures.',
    source: 'CROWN Act Research Study',
    year: 2021,
  },
  {
    fact: '84% of Black women have reported experiencing hair discrimination before the age of 12',
    description: 'Early experiences with hair discrimination can impact self-image and confidence.',
    source: 'Dove CROWN Research Study',
    year: 2021,
  },
  {
    fact: 'Nearly 50% of Black women report spending more than $500 annually on hair care products',
    description: 'The financial burden of trial and error with hair products is significant.',
    source: 'Nielsen Consumer Report on Black Hair Care',
    year: 2022,
  },
  {
    fact: '68% of Black women report experiencing scalp issues due to improper product usage',
    description: 'Lack of proper education leads to preventable hair and scalp problems.',
    source: 'American Academy of Dermatology Association',
    year: 2022,
  },
  {
    fact: '91% of Black women agree that natural hair representation in media needs improvement',
    description: 'Media representation plays a crucial role in hair acceptance and education.',
    source: "Perception Institute's 'Good Hair' Study",
    year: 2020,
  },
  {
    fact: '73% of Black women have purchased more than 5 different product lines before finding what works',
    description: 'Finding the right products often involves costly experimentation.',
    source: 'TextureMedia Natural Hair Product Survey',
    year: 2021,
  },
  {
    fact: '82% of Black women have changed their natural hair care routine at least 3 times in the past year',
    description: 'Consistency in hair care routines is challenging without proper guidance.',
    source: 'Black Hair Experience Survey',
    year: 2022,
  },
  {
    fact: '89% of Black women believe having a community support system would have made their natural hair journey easier',
    description: 'Community support is crucial for successful natural hair care.',
    source: 'Natural Hair Community Impact Study',
    year: 2022,
  },
];

export function getRandomFact(): HairFact {
  const randomIndex = Math.floor(Math.random() * hairFacts.length);
  return hairFacts[randomIndex];
}

interface AnswerFacts {
  answer: string;
  facts: HairFact[];
}

export const GIVING_UP_FACTS: AnswerFacts[] = [
  {
    answer: "Yes, it's overwhelming",
    facts: [hairFacts[0], hairFacts[1], hairFacts[3], hairFacts[4], hairFacts[5], hairFacts[6]],
  },
  {
    answer: "I'm trying, but struggling",
    facts: [hairFacts[7], hairFacts[8], hairFacts[4], hairFacts[5], hairFacts[2], hairFacts[6]],
  },
  {
    answer: "Nope, I'm fully committed",
    facts: [hairFacts[9], hairFacts[6], hairFacts[2], hairFacts[3], hairFacts[8], hairFacts[0]],
  },
];

export function getFactForAnswer(answer: string): HairFact {
  const answerFacts = GIVING_UP_FACTS.find((item) => item.answer === answer)?.facts || [];
  const randomIndex = Math.floor(Math.random() * answerFacts.length);
  return answerFacts[randomIndex];
}
