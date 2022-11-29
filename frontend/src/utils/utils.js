export const dateFormatted = (dateString) => {
   return new Date(dateString)
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, "/")
      .replace("T", " ");
};
