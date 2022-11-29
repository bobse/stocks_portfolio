import { Box, VStack } from "@chakra-ui/react";

export const TopTotal = (props) => {
   return (
      <VStack mt={2} mb={6} mr={4} alignItems="flex-start">
         <Box
            textTransform={"uppercase"}
            fontSize="xx-small"
            whiteSpace={"pre-line"}
            opacity="0.6"
            mb={-2}
         >
            {props.text}
         </Box>
         <Box fontSize="xl" fontWeight={"bold"} color={"green.400"}>
            {props.type === "value" ? "$" : ""} {props.value.toFixed(2)}{" "}
            {props.type === "perc" ? "%" : ""}
         </Box>
      </VStack>
   );
};
