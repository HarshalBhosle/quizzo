export const adjustDifficulty = (score) => {
  if (score < 40) return "easy";
  if (score < 70) return "medium";
  return "hard";
};
