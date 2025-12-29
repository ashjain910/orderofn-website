export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
};

export const formatDateWithDay = (dateStr) => {
  if (!dateStr) return '';
  const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }; // Use 'short' for abbreviated weekday
  return new Date(dateStr).toLocaleDateString('en-US', options);
};