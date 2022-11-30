import { React } from "react";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import { ChakraProvider, VStack, Box } from "@chakra-ui/react";
import { customTheme } from "./Theme/CustomTheme";
import {
   Routes,
   Route,
   BrowserRouter,
   useLocation,
   Navigate,
} from "react-router-dom";
// import auth from "./services/auth";
import { Header } from "./components/Header/Header";
import { Portfolio } from "./routes/Portfolio/Portfolio";
import { Trades } from "./routes/Trades/Trades";
import { Incomes } from "./routes/Incomes/Incomes";

function App() {
   return (
      <ChakraProvider theme={customTheme}>
         <VStack
            h={"99vh"}
            w={"100vw"}
            maxW={"400px"}
            m="auto"
            bgColor="gray.800"
            px={4}
            pb={4}
         >
            <BrowserRouter>
               <Header />
               <Box w={"full"} h={"full"} overflow={"hidden"}>
                  <Routes>
                     <Route path="/" element={<Portfolio />} />
                     <Route path="/trades" element={<Trades />} />
                     <Route path="/incomes" element={<Incomes />} />
                     {/* <Route
                     path="/"
                     element={
                        <RequireAuth>
                           <DirectorsPage />
                        </RequireAuth>
                     }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route
                     path="/emailconfirmation"
                     element={<ConfirmationEmailPage />}
                  />
                  <Route
                     path="/forgotpassword"
                     element={<ForgotPasswordPage />}
                  />
                  <Route path="/newpassword" element={<NewPasswordPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/*" element={<NotFoundPage />} /> */}
                  </Routes>
               </Box>
            </BrowserRouter>
         </VStack>
      </ChakraProvider>
   );
}

// function RequireAuth({ children }) {
//    let location = useLocation();
//    auth.silentAuth();
//    if (auth.isAuthenticated()) {
//       return children;
//    } else {
//       return <Navigate to="/login" state={{ from: location }} replace />;
//    }
// }

export default App;
