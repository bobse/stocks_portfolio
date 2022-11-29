import { defineStyleConfig } from "@chakra-ui/react";

export const Input = defineStyleConfig({
   // The styles all button have in common
   baseStyle: {
      borderRadius: "0", // <-- border radius is same for all variants and sizes
   },
   variants: {
      text: {
         field: {
            bg: "whiteAlpha.300",
            border: "1px",
            borderColor: "blackAlpha.400",
            outline: "1",
            outlineColor: "gray.700",
         },
      },
   },

   defaultProps: {
      size: "md",
      variant: "text",
   },
});
