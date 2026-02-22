/**
 * Format currency values from blockchain (USDC with 7 decimals)
 * @param amount - Raw amount from blockchain (e.g., 10000000 for 1 USDC)
 * @returns Formatted USD string (e.g., "$1.00")
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '$0.00';
  }
  
  // USDC has 7 decimals, so divide by 10^7
  const usdcAmount = numAmount / 10000000;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdcAmount);
};

/**
 * Format Unix timestamp to human-readable date
 * @param timestamp - Unix timestamp (seconds or milliseconds)
 * @returns Formatted date string (e.g., "Oct 24, 2024")
 */
export const formatDate = (timestamp: number | string): string => {
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  
  if (isNaN(numTimestamp)) {
    return 'Invalid Date';
  }
  
  // Handle both seconds and milliseconds timestamps
  const date = new Date(
    numTimestamp.toString().length === 10 
      ? numTimestamp * 1000  // Convert seconds to milliseconds
      : numTimestamp          // Already in milliseconds
  );
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format full date with time
 * @param timestamp - Unix timestamp (seconds or milliseconds)
 * @returns Formatted date-time string (e.g., "Oct 24, 2024, 2:30 PM")
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
 * Format wallet address for display
 * @param address - Full wallet address
 * @returns Shortened address (e.g., "0x1234...5678")
 */
export const formatAddress = (address: string): string => {
  if (!address || address.length < 8) {
    return address;
  }
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format percentage with proper decimal places
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | string, decimals: number = 1): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0%';
  }
  
  return `${numValue.toFixed(decimals)}%`;
};
