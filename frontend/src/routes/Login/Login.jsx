import { Box, Center, Heading, Text, Image, VStack } from "@chakra-ui/react";
import GoogleButton from "../../assets/google_login.png";
import Logo from "../../assets/logo.png";

import auth from "../../services/auth";

export const Login = (props) => {
   return (
      <VStack
         w={"100vw"}
         maxW={"400px"}
         m="auto"
         bgColor="gray.800"
         px={4}
         pb={4}
         pt={10}
         mt={8}
         alignItems="flex-end"
      >
         <Box pb={8} w="full">
            <Center alignItems={"flex-start"}>
               <Image src={Logo} w="100px" mr={4} />
               <Heading pb={4}>Stocks Portfolio Manager</Heading>
            </Center>
            <Text>To access your stock portfolio you must login:</Text>
         </Box>
         <Box w={"full"}>
            <Center>
               <Image
                  cursor="pointer"
                  onClick={auth.login}
                  src={GoogleButton}
                  maxW="80%"
               />
            </Center>
         </Box>
      </VStack>
   );
};
