import React from "react";
import { Box, HStack, Spacer, VStack, Text, Flex } from "@chakra-ui/react";
import { ThreeDots } from "../../components/ThreeDots/ThreeDots";
import { LabeledInfo } from "../../components/LabeledInfo/LabeledInfo";
import { TopTotal } from "../../components/TopTotal/TopTotal";

export const Portfolio = (props) => {
   const testData = [
      {
         ticker: "PETR4",
         currAvgPrice: 20.01,
         currTotalAmount: 100,
         totalIncome: 2000.0,
         lastTrade: "2023-01-01T12:25:43.159Z",
         today: {
            percentage: 2.1,
            price: 24.36,
         },
         profits: {
            value: 435,
            percentage: 21.74,
         },
      },
      {
         ticker: "VALE5",
         currAvgPrice: 20.01,
         currTotalAmount: 100,
         totalIncome: 2000.0,
         lastTrade: "2023-01-01T12:25:43.159Z",
         today: {
            percentage: 2.1,
            price: 24.36,
         },
         profits: {
            value: -435,
            percentage: -21.74,
         },
      },
      {
         ticker: "AESB3",
         currAvgPrice: 20.01,
         currTotalAmount: 100,
         totalIncome: 2000.0,
         lastTrade: "2023-01-01T12:25:43.159Z",
         today: {
            percentage: 2.1,
            price: 24.36,
         },
         profits: {
            value: 435,
            percentage: 21.74,
         },
      },
   ];
   return (
      <>
         <Flex>
            <TopTotal value={5000} text="total invested" type="value" />
            <TopTotal value={2000.02} text="total P&L" type="value" />
            <TopTotal value={20.2} text="total P&L %" type="perc" />
         </Flex>
         <VStack p={0} w="full" overflow={"scroll"} maxH="85%" pb={6}>
            {testData.map((data, idx) => (
               <PortfolioCard key={idx} data={data} />
            ))}
         </VStack>
      </>
   );
};

const PortfolioCard = (props) => {
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
               <Box fontSize={"2xl"} color="white" fontWeight={"bold"} pl={2}>
                  {props.data.ticker}
               </Box>
               <Spacer />
               <HStack alignItems={"flex-start"} p={0} spacing={1}>
                  <VStack
                     spacing={0}
                     alignItems="flex-end"
                     fontSize={"md"}
                     fontWeight="bold"
                     color={"green.400"}
                  >
                     <Text>${props.data.today.price}</Text>
                     <Text>{props.data.today.percentage}%</Text>
                  </VStack>
                  <ThreeDots boxSize={5} pt={1} />
               </HStack>
            </Flex>
            <Flex w="full" pt={8}>
               <LabeledInfo
                  value={props.data.currTotalAmount}
                  text="total amount"
               />
               <Spacer />
               <LabeledInfo
                  value={`$ ${props.data.currAvgPrice.toFixed(2)}`}
                  text="avg price"
               />
               <Spacer />
               <LabeledInfo
                  value={`$ ${props.data.totalIncome.toFixed(2)}`}
                  text="total income"
               />
               <Spacer />
               <LabeledInfo
                  value={`$ ${(
                     props.data.currAvgPrice * props.data.currTotalAmount
                  ).toFixed(2)}`}
                  text="total invested"
               />
            </Flex>
            <Flex
               w="full"
               color={props.data.profits.value > 0 ? "green.400" : "red.400"}
               fontSize={"xs"}
               borderTop="1px"
               pt={2}
               px={2}
               fontWeight={"bold"}
            >
               <Text>P&L</Text>
               <Spacer />
               <Text>$ {props.data.profits.value.toFixed(2)}</Text>
               <Text pl={4}>{props.data.profits.percentage.toFixed(2)}%</Text>
            </Flex>
         </VStack>
      </Box>
   );
};
