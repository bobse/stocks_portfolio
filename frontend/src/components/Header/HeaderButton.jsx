import React from "react";
import { Button } from "@chakra-ui/react";

export const HeaderButton = (props) => {
   return (
      <Button
         textAlign={"left"}
         bgColor={props.isActive ? "green.400" : "gray.700"}
         color={props.isActive ? "gray.900" : "white"}
         w="70px"
         h="70px"
         alignItems={"flex-end"}
         p={2}
         borderRadius={8}
         textTransform={"uppercase"}
         fontSize={"2xs"}
         isDisabled={props.isDisabled}
         onClick={props.onClick}
         _hover={"none"}
      >
         {props.children}
      </Button>
   );
};
