/**
 * Calculate the remaining days until the deadline.
 * 
 * @param {Date} deadline The deadline date.
 * @returns {number | null} The remaining days until the deadline, or null if the deadline has passed.
 */
export const calculateRemainingDays = (deadline: Date): number | null => {
    // Get the current date
    const now = new Date();
  
    // Calculate the difference in milliseconds between the deadline and the current date
    const diffTime = deadline.getTime() - now.getTime();
  
    // Calculate the difference in days and round up to the nearest whole number
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays;
  };
  