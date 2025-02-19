export const formatDate = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',

  hour12: true,
});
