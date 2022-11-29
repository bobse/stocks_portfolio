import React from "react";
import { Box, Center, HStack, Link, Spacer, Divider } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const Footer = (props) => {
   return (
      <Box alignSelf={"flex-end"} color={"gray.500"} w="full" mt={16}>
         <Divider />
         <Center h={[24, 8]} fontSize={"0.7rem"} pt={4}>
            <HStack w={"full"} p={4} spacing={4}>
               <RouterLink to="/about">About</RouterLink>
               <Link href="mailto:roberto@robertoseba.com">Contact me</Link>
               <Spacer />
               <Box maxW={"30%"}>Created and maintained by Roberto Seba</Box>
            </HStack>
         </Center>
      </Box>
   );
};
