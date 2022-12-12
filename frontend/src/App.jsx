import React from "react";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import { ChakraProvider, VStack, Box } from "@chakra-ui/react";
import { customTheme } from "./Theme/CustomTheme";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Portfolio } from "./routes/Portfolio/Portfolio";
import { Trades } from "./routes/Trades/Trades";
import { Incomes } from "./routes/Incomes/Incomes";
import { Login } from "./routes/Login/Login";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response.status === 401) {
         window.location.href = "/login";
      } else {
         return Promise.reject(error);
      }
   }
);

function App() {
   return (
      <ChakraProvider theme={customTheme}>
         <BrowserRouter>
            <Routes>
               <Route
                  path="/"
                  element={
                     <ContainerWithHeader>
                        <Portfolio />
                     </ContainerWithHeader>
                  }
               />
               <Route
                  path="/trades"
                  element={
                     <ContainerWithHeader>
                        <Trades />
                     </ContainerWithHeader>
                  }
               />
               <Route
                  path="/incomes"
                  element={
                     <ContainerWithHeader>
                        <Incomes />
                     </ContainerWithHeader>
                  }
               />
               <Route path="/login" element={<Login />} />
            </Routes>
         </BrowserRouter>
      </ChakraProvider>
   );
}

const ContainerWithHeader = (props) => {
   return (
      <VStack
         h={"99vh"}
         w={"100vw"}
         maxW={"400px"}
         m="auto"
         bgColor="gray.800"
         px={4}
         pb={4}
      >
         <Header />
         <Box w={"full"} h={"full"} overflow={"hidden"}>
            {props.children}
         </Box>
      </VStack>
   );
};

export default App;
