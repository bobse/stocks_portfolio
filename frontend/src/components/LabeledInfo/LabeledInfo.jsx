import { Box, VStack } from "@chakra-ui/react";

export const LabeledInfo = (props) => {
   return (
      <VStack px={2} spacing={0} alignItems="flex-end" textAlign={"right"}>
         <Box
            textTransform={"uppercase"}
            fontSize="xx-small"
            whiteSpace={"pre-line"}
            opacity="0.4"
         >
            {props.text.split(" ").join("\n")}
         </Box>
         <Box fontSize="small" color={"white"}>
            {props.value}
         </Box>
      </VStack>
   );
};
