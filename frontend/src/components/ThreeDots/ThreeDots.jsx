import { Icon } from "@chakra-ui/react";
import React from "react";

export function ThreeDots(props) {
   return (
      <Icon {...props} viewBox="0 0 1 17">
         <ellipse cx="2" cy="2.045" fill="currentColor" rx="2" ry="2.045" />
         <ellipse cx="2" cy="7.5" fill="currentColor" rx="2" ry="2.045" />
         <ellipse cx="2" cy="12.954" fill="currentColor" rx="2" ry="2.045" />
      </Icon>
   );
}
