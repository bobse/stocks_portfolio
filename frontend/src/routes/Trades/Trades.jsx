import React from "react";
import { Box, HStack, Spacer, VStack, Text, Flex } from "@chakra-ui/react";
import { ThreeDots } from "../../components/ThreeDots/ThreeDots";
import { LabeledInfo } from "../../components/LabeledInfo/LabeledInfo";
import { TopTotal } from "../../components/TopTotal/TopTotal";
import { FilterTop } from "../../components/FilterTop/FilterTop";
import { dateFormatted } from "../../utils/utils";

export const Trades = (props) => {
   const testData = {
      results: [
         {
            _id: "63863d1b76ebc0a6d106b5bc",
            date: "2023-02-01T12:25:43.159Z",
            userEmail: "roberto@robertoseba.com",
            ticker: "PETR4",
            price: 20,
            amount: 100,
            fees: 1.01,
            valuesUpToDate: true,
            currAvgPrice: 20.01,
            currTotalAmount: 200,
            __v: 0,
            year: 2023,
         },
         {
            _id: "63860037848864d63043a696",
            date: "2023-01-01T12:25:43.159Z",
            userEmail: "roberto@robertoseba.com",
            ticker: "PETR4",
            price: 19,
            amount: -100,
            fees: 1.01,
            valuesUpToDate: true,
            currAvgPrice: 20.01,
            currTotalAmount: 100,
            __v: 0,
            year: 2023,
         },
      ],
      pagination: {
         totalCount: 2,
         limit: 50,
         page: 1,
         hasNext: false,
         hasPrevious: false,
      },
   };
   return (
      <>
         <VStack alignItems={"flex-start"} spacing={2} pb={6}>
            <FilterTop year="2022" ticker="PETR4" />
            <TopTotal value={2000.02} text="total P&L" type="value" />
         </VStack>
         <VStack p={0} w="full" overflow={"scroll"} maxH="85%" pb={6}>
            {testData.results.map((data, idx) => (
               <TradeCard key={idx} data={data} />
            ))}
         </VStack>
      </>
   );
};

const TradeCard = (props) => {
   let total = props.data.price * Math.abs(props.data.amount);
   if (props.data.amount > 0) {
      total += props.data.fees;
   } else {
      total -= props.data.fees;
   }
   const pLValue =
      total - props.data.currAvgPrice * Math.abs(props.data.amount);
   const pLPerc =
      (pLValue / (props.data.currAvgPrice * Math.abs(props.data.amount))) * 100;
   return (
      <Box
         borderRadius={6}
         border="1px"
         borderColor={"gray.700"}
         p={2}
         w="full"
         mb={4}
      >
         <VStack>
            <Flex w="full" p={0}>
               <VStack textAlign={"left"} alignItems={"flex-start"} spacing={0}>
                  <Box fontSize={"2xs"} color="gray.400" pl={2}>
                     {dateFormatted(props.data.date)}
                  </Box>
                  <Box
                     fontSize={"2xl"}
                     color="white"
                     fontWeight={"bold"}
                     pl={2}
                  >
                     {props.data.ticker}
                  </Box>
               </VStack>
               <Spacer />
               <HStack
                  spacing={4}
                  alignItems="flex-end"
                  fontSize={"xs"}
                  fontWeight="bold"
               >
                  <LabeledInfo
                     value={`$ ${props.data.currAvgPrice.toFixed(2)}`}
                     text="avg price"
                  />
                  <LabeledInfo
                     value={props.data.currTotalAmount}
                     text="total amount"
                  />
               </HStack>
               <ThreeDots boxSize={5} pt={1} />
            </Flex>
            <Flex w="full" pt={6} flexGrow="1" alignItems={"flex-end"}>
               <LabeledInfo value={props.data.amount} text="total amount" />
               <Spacer />
               <LabeledInfo
                  value={`$ ${props.data.price.toFixed(2)}`}
                  text="avg price"
               />
               <Spacer />
               <LabeledInfo
                  value={`$ ${props.data.fees.toFixed(2)}`}
                  text="fees"
               />
               <Spacer />
               <LabeledInfo value={`$ ${total.toFixed(2)}`} text="total" />
            </Flex>
            {props.data.amount < 0 && (
               <Flex
                  w="full"
                  color={pLValue > 0 ? "green.400" : "red.400"}
                  fontSize={"xs"}
                  borderTop="1px"
                  pt={2}
                  px={2}
                  fontWeight={"bold"}
               >
                  <Text>P&L</Text>
                  <Spacer />
                  <Text>$ {pLValue.toFixed(2)}</Text>
                  <Text pl={4}>{pLPerc.toFixed(2)}%</Text>
               </Flex>
            )}
         </VStack>
      </Box>
   );
};
