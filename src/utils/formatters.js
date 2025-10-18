export const formatDate = (timestamp) => {
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  if (timestamp?.toDate) {
    return timestamp.toDate().toLocaleDateString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString();
  }
  return 'Unknown date';
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return parseFloat(rating).toFixed(1);
};

export const formatYear = (dateString) => {
  if (!dateString) return 'N/A';
  return dateString.substring(0, 4);
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};