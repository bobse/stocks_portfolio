import React from "react";

import { Tooltip, Box } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

const Notes = React.forwardRef(({ children, ...rest }, ref) => {
   return (
      <Box ref={ref} {...rest} ml={2} display="inline-block">
         <Tooltip label={children} fontSize="md" bgColor={"green.400"}>
            <InfoIcon color={"green.400"} fontSize={"2xs"} />
         </Tooltip>
      </Box>
   );
});

export { Notes };
