export const formatDateTime = (isoDate) =>
  new Date(isoDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default formatDateTime;
