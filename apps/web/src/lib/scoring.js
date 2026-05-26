import { hashFromTwoDates } from './deterministic.js';

// weights: chemistry 25, communication 20, stability 20, growth 20, intuition 15
export const defaultWeights = {
  chemistry: 0.25,
  communication: 0.2,
  stability: 0.2,
  growth: 0.2,
  intuition: 0.15,
};

export function computeFiveLayerScores(dob1, dob2) {
  // produce deterministic base between 0..100 for each metric using hash offsets
  const base = hashFromTwoDates(dob1, dob2, 100);

  // split hash into components deterministically
  const chemistry = (base + hashFromTwoDates('chem', dob1, 101)) % 101;
  const communication = (base + hashFromTwoDates('comm', dob2, 101)) % 101;
  const stability = (base + hashFromTwoDates('stab', dob1 + dob2, 101)) % 101;
  const growth = (base + hashFromTwoDates('grow', dob2 + dob1, 101)) % 101;
  const intuition = (base + hashFromTwoDates('intu', dob1, 101)) % 101;

  // ensure 0..100
  return {
    chemistry: Math.round(chemistry),
    communication: Math.round(communication),
    stability: Math.round(stability),
    growth: Math.round(growth),
    intuition: Math.round(intuition),
    overall: Math.round(
      chemistry * defaultWeights.chemistry +
      communication * defaultWeights.communication +
      stability * defaultWeights.stability +
      growth * defaultWeights.growth +
      intuition * defaultWeights.intuition
    )
  };
}
