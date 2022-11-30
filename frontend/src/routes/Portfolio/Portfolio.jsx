import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, HStack, Spacer, VStack, Text, Flex } from "@chakra-ui/react";
import { ThreeDots } from "../../components/ThreeDots/ThreeDots";
import { LabeledInfo } from "../../components/LabeledInfo/LabeledInfo";
import { TopTotal } from "../../components/TopTotal/TopTotal";
import { APIPORTFOLIO } from "../../constants";

export const Portfolio = (props) => {
   const [portfolioData, setPortfolioData] = useState([]);
   const [totals, setTotals] = useState({
      totalInvested: 0,
      currTotalValue: 0,
      totalPL: 0,
      totalPLPerc: 0,
   });

   useEffect(() => {
      async function refreshPortfolio() {
         try {
            const response = await axios.get(APIPORTFOLIO);
            if (response.data.length > 0) {
               setPortfolioData(response.data);
               updateTotals(response.data);
            }
         } catch (err) {
            console.log(err);
         }
      }

      function updateTotals(data) {
         const totalInvested = data.reduce((prev, elem) => {
            return elem.currAvgPrice * elem.currTotalAmount + prev;
         }, 0);
         const currTotalValue = data.reduce((prev, elem) => {
            return elem.today.price * elem.currTotalAmount + prev;
         }, 0);
         const totalPL = currTotalValue - totalInvested;
         const totalPLPerc = (currTotalValue / totalInvested - 1) * 100;
         setTotals({ totalInvested, currTotalValue, totalPL, totalPLPerc });
      }
      refreshPortfolio();
   }, []);

   return (
      <>
         <Flex flexWrap={"wrap"} mb={4}>
            <TopTotal
               value={totals.totalInvested}
               text="total invested"
               type="value"
            />
            <TopTotal
               value={totals.currTotalValue}
               text="curr. value"
               type="value"
            />
            <TopTotal
               value={totals.totalPL}
               text="total PROFITS"
               type="value"
            />
            <TopTotal
               value={totals.totalPLPerc}
               text="total PROFITS %"
               type="perc"
            />
         </Flex>
         <VStack w="full" overflow={"scroll"} h="70vh" pb={10}>
            {portfolioData.map((data, idx) => (
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
         borderColor={props.data.profits.value > 0 ? "green.800" : "red.800"}
         p={2}
         w="full"
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
               borderTopColor={"gray.700"}
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
