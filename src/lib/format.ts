/**
 * Format currency values
 * @param amount - Amount to format
 * @param isRaw - If true, divides by 10^7 (standard for USDC on Stellar)
 * @returns Formatted USD string
 */
export const formatCurrency = (amount: number | string, isRaw: boolean = true): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '$0.00';
  }
  
  // If raw from blockchain (USDC has 7 decimals), divide by 10^7
  // Otherwise, use the number as is (pre-calculated USD)
  const usdcAmount = isRaw ? numAmount / 10000000 : numAmount;
  
  // 3. Format using standard US locale settings
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdcAmount);
};

/**
 * Formats a generic token amount with a specified number of decimals.
 * 
 * @param {number | string} amount - The raw token amount.
 * @param {number} [decimals=7] - Number of decimal places for the asset.
 * @returns {string} The formatted number string.
 */
export const formatTokenAmount = (amount: number | string, decimals: number = 7): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "0";
  
  const value = numAmount / Math.pow(10, decimals);
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formats a Unix timestamp into a human-readable date string.
 * Supports both seconds (10 digits) and milliseconds (13 digits) formats.
 * 
 * @param {number | string} timestamp - The Unix timestamp to format.
 * @returns {string} Formatted date (e.g., "Oct 24, 2024") or "Invalid Date".
 */
export const formatDate = (timestamp: number | string): string => {
  // 1. Ensure we have a numeric value
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  
  if (isNaN(numTimestamp)) {
    return 'Invalid Date';
  }
  
  // 2. Detect format based on digit count
  // Unix seconds = 10 digits, Milliseconds = 13 digits
  const date = new Date(
    numTimestamp.toString().length === 10 
      ? numTimestamp * 1000  // Convert seconds to milliseconds
      : numTimestamp          // Already in milliseconds
  );
  
  // 3. Check for invalid date objects
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  // 4. Localized short date format
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats a Unix timestamp into a detailed date and time string.
 * Useful for transaction history or specific event logging.
 * 
 * @param {number | string} timestamp - The Unix timestamp to format.
 * @returns {string} Formatted date-time (e.g., "Oct 24, 2024, 2:30 PM").
 */
export const formatDateTime = (timestamp: number | string): string => {
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  
  if (isNaN(numTimestamp)) {
    return 'Invalid Date';
  }
  
  const date = new Date(
    numTimestamp.toString().length === 10 
      ? numTimestamp * 1000
      : numTimestamp
  );
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Shortens a Stellar or Ethereum wallet address for UI display.
 * Shows the first 6 and last 4 characters by default.
 * 
 * @param {string} address - The full wallet address string.
 * @returns {string} The truncated address (e.g., "GBBD67...OC6S").
 */
export const formatAddress = (address: string): string => {
  if (!address || address.length < 12) {
    return address;
  }
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Formats a numeric value as a percentage string.
 * 
 * @param {number | string} value - The raw percentage value (e.g., 5.5 for 5.5%).
 * @param {number} [decimals=1] - Precision of the output.
 * @returns {string} Formatted percentage (e.g., "5.5%").
 */
export const formatPercentage = (value: number | string, decimals: number = 1): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0%';
  }
  
  return `${numValue.toFixed(decimals)}%`;
};

