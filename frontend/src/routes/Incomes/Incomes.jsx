import React from "react";
import {
   Box,
   HStack,
   Spacer,
   VStack,
   Text,
   Flex,
   Button,
} from "@chakra-ui/react";
import { ThreeDots } from "../../components/ThreeDots/ThreeDots";
import { TopTotal } from "../../components/TopTotal/TopTotal";
import { FilterTop } from "../../components/FilterTop/FilterTop";
import { dateFormatted } from "../../utils/utils";

export const Incomes = (props) => {
   const FilterButton = (props) => {
      return (
         <Button
            {...props}
            border={0}
            textTransform="uppercase"
            background="none"
            color={props.isActive ? "white" : "gray.400"}
            fontSize="md"
            p={2}
            isDisabled={props.isDisabled}
            _active={{ bgcolor: "none" }}
            _hover={{ bgcolor: "none", color: "green.400" }}
         >
            {props.children}
         </Button>
      );
   };

   const testData = {
      results: [
         {
            _id: "63860073848864d63043a6a2",
            date: "2022-12-12T14:21:43.965Z",
            userEmail: "roberto@robertoseba.com",
            ticker: "PETR4",
            value: 50.5,
            category: "DIVIDENDS",
            __v: 0,
            year: 2022,
         },
         {
            _id: "63865e8276ebc0a6d106b5c6",
            date: "2022-02-12T14:21:43.965Z",
            userEmail: "roberto@robertoseba.com",
            ticker: "PETR4",
            value: 150.5,
            category: "DIVIDENDS",
            __v: 0,
            year: 2022,
         },
         {
            _id: "63865e7d76ebc0a6d106b5c4",
            date: "2022-01-12T14:21:43.965Z",
            userEmail: "roberto@robertoseba.com",
            ticker: "PETR4",
            value: 150.5,
            category: "DIVIDENDS",
            __v: 0,
            year: 2022,
         },
      ],
      pagination: {
         totalCount: 3,
         limit: 50,
         page: 1,
         hasNext: false,
         hasPrevious: false,
      },
   };
   return (
      <>
         <VStack alignItems={"flex-start"} spacing={2} pb={6} w="full">
            <FilterTop year={2022} ticker="PETR4" />
            <TopTotal value={2000.02} text="total income" type="value" />
            <HStack w="full" spacing={2}>
               <Spacer />
               <FilterButton isActive={true}>ALL</FilterButton>
               <FilterButton>Dividends</FilterButton>
               <FilterButton>interests</FilterButton>
            </HStack>
         </VStack>
         <VStack p={0} w="full" overflow={"scroll"} maxH="85%" spacing={4}>
            {testData.results.map((data, idx) => (
               <IncomeCard key={idx} data={data} />
            ))}
         </VStack>
      </>
   );
};

const IncomeCard = (props) => {
   return (
      <Box
         borderRadius={6}
         border="1px"
         borderColor={"gray.700"}
         p={2}
         w="full"
      >
         <VStack>
            <Flex w="full" p={0} justifyContent={"center"} alignItems="center">
               <VStack
                  flexGrow={1}
                  textAlign={"left"}
                  alignItems={"flex-start"}
                  spacing={0}
               >
                  <Box fontSize={"2xs"} color="gray.400" pl={2}>
                     {dateFormatted(props.data.date)}
                  </Box>
                  <Box
                     fontSize={"2xl"}
                     color="white"
                     fontWeight={"bold"}
                     pl={2}
                  >
                     <Text>{props.data.ticker}</Text>
                     <Text fontSize={"xs"} color="green.400" mt={-1}>
                        {props.data.category}
                     </Text>
                  </Box>
               </VStack>
               <Box
                  fontSize={"xl"}
                  fontWeight={"bold"}
                  color="green.400"
                  px={2}
               >
                  $ {props.data.value.toFixed(2)}
               </Box>
               <ThreeDots boxSize={5} pt={1} />
            </Flex>
         </VStack>
      </Box>
   );
};
