/**
 * Utility functions for the Landing Page
 */

/**
 * Formats a number into a currency string (e.g., 500000 -> $500K)
 * @param {number} num - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (num) => {
  if (num === undefined || num === null) return "$0K";
  return `$${(num / 1000).toFixed(0)}K`;
};

/**
 * Calculates the progress percentage between raised and goal amounts
 * @param {number} raised - The amount raised
 * @param {number} goal - The goal amount
 * @returns {number} Progress percentage (0-100)
 */
export const getProgress = (raised, goal) => {
  if (!goal) return 0;
  return Math.min((raised / goal) * 100, 100);
};

/**
 * Smooth scrolls to a specific section by ID
 * @param {string} sectionId - The ID of the target element
 */
export const handleScrollTo = (sectionId) => {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
