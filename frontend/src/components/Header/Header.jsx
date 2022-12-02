import React from "react";
import { HStack } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderButton } from "./HeaderButton";
import auth from "../../services/auth";

export const Header = (props) => {
   const navigate = useNavigate();
   const location = useLocation();
   const currButton = location.pathname.split("/")[1];
   return (
      <HStack
         w={"full"}
         overflowX="scroll"
         overflowY={"hidden"}
         py={4}
         bgColor="gray.800"
      >
         <HeaderButton
            onClick={() => {
               navigate("/");
            }}
            isActive={currButton.toLowerCase() === ""}
         >
            Home
         </HeaderButton>
         <HeaderButton
            isActive={currButton.toLowerCase() === "incomes"}
            onClick={() => {
               navigate("/incomes");
            }}
         >
            Incomes
         </HeaderButton>
         <HeaderButton
            isActive={currButton.toLowerCase() === "trades"}
            onClick={() => {
               navigate("/trades");
            }}
         >
            Trades
         </HeaderButton>
         <HeaderButton
            onClick={() => {
               auth.logout();
            }}
         >
            Logout
         </HeaderButton>
         {/* <HeaderButton isDisabled={true}>Reports</HeaderButton> */}
      </HStack>
   );
};
