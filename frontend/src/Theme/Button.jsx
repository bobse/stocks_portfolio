import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
   // The styles all button have in common
   baseStyle: {
      fontWeight: "bold",
      // textTransform: 'uppercase',
      borderRadius: "0", // <-- border radius is same for all variants and sizes
   },
   variants: {
      outline: {
         border: "1px solid",
         borderColor: "black",
         color: "black",
      },
      solid: {
         bg: "gray.400",
         color: "black",
      },
      transparent: {
         bg: "none",
      },
      off: {
         opacity: 0.2,
         border: "1px solid",
         borderColor: "black",
         color: "black",
      },
   },
   // The default size and variant values
   defaultProps: {
      size: "sm",
      variant: "solid",
   },
});
