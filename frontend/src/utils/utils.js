export const dateFormatted = (dateString) => {
   return new Date(dateString).toLocaleString();
   // .toISOString()
   // .slice(0, 19)
   // .replace(/-/g, "/")
   // .replace("T", " ");
};
