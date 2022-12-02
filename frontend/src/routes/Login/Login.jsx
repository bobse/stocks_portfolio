import { Box, Center, Heading, Text, Image, VStack } from "@chakra-ui/react";
import GoogleButton from "../../assets/google_login.png";
import auth from "../../services/auth";

export const Login = (props) => {
   return (
      <VStack
         h={"99vh"}
         w={"100vw"}
         maxW={"400px"}
         m="auto"
         bgColor="gray.800"
         px={4}
         pb={4}
         pt={10}
      >
         <Box pb={8}>
            <Heading pb={4}>Please Login</Heading>
            <Text>
               To access your stock portfolio you must login with the following:
            </Text>
         </Box>
         <Box>
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
