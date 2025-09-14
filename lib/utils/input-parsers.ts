/**
 * Input parsing utilities for converting user input to structured data
 */

export function parseHeight(input: string, units: 'metric' | 'imperial'): number {
  const cleaned = input.toLowerCase().replace(/[^\d.'"]/g, '');
  
  if (units === 'metric') {
    // Parse metric height (e.g., "165", "1.65", "165cm")
    const number = parseFloat(cleaned);
    // Convert to cm if given in meters
    return number < 3 ? number * 100 : number;
  } else {
    // Parse imperial height (e.g., "5'5\"", "65", "5.5")
    if (cleaned.includes("'")) {
      // Format like "5'5"
      const parts = cleaned.split("'");
      const feet = parseInt(parts[0]) || 0;
      const inches = parseInt(parts[1]) || 0;
      return feet * 12 + inches; // Return total inches
    } else {
      // Assume inches if single number
      const number = parseFloat(cleaned);
      return number > 12 ? number : number * 12; // Convert feet to inches if needed
    }
  }
}

export function parseWeight(input: string): number {
  const cleaned = input.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}