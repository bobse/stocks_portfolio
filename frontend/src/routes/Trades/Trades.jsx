import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, HStack, Spacer, VStack, Text, Flex } from "@chakra-ui/react";
import { ThreeDots } from "../../components/ThreeDots/ThreeDots";
import { LabeledInfo } from "../../components/LabeledInfo/LabeledInfo";
import { TopTotal } from "../../components/TopTotal/TopTotal";
import { FilterTop } from "../../components/FilterTop/FilterTop";
import { dateFormatted } from "../../utils/utils";
import { APITRADES, APITOTALTRADES } from "../../constants";
import { CustomButton } from "../../components/Button/Button";

export const Trades = (props) => {
   const [tradesData, setTradesData] = useState([]);
   const [totals, setTotals] = useState({
      totalProfits: 0,
   });
   const [pagination, setPagination] = useState();
   const [filters, setFilters] = useState({
      ticker: "all",
      year: "all",
      category: "all",
   });
   const [tickersList, setTickersList] = useState([]);

   const getTradesData = useCallback(
      async (page = 1, limit = 25) => {
         let url = APITRADES;
         url += `/${filters.year}`;
         if (filters.ticker !== "all") url += `/${filters.ticker}`;
         if (filters.category.toUpperCase() !== "ALL") {
            url += `?category=${filters.category}&limit=${limit}&page=${page}`;
         } else {
            url += `?limit=${limit}&page=${page}`;
         }

         const response = await axios.get(url);
         return response.data;
      },
      [filters]
   );

   const loadTradesData = useCallback(async () => {
      const updateTotals = async () => {
         let url = APITOTALTRADES;
         url += `/${filters.year}`;
         if (filters.ticker !== "all") url += `/${filters.ticker}`;
         const response = await axios.get(url);
         if (response.data.length > 0) {
            const totalProfits = response.data.reduce((prev, elem) => {
               return elem.totalProfits + prev;
            }, 0);

            setTotals({ totalProfits });
         } else {
            resetTotals();
         }
      };
      try {
         const data = await getTradesData();
         if (data) {
            setTradesData(data.results);
            setPagination(data.pagination);
         }
         updateTotals();
      } catch (err) {
         console.log(err);
      }
   }, [filters, getTradesData]);

   function resetTotals() {
      const resetValues = { ...totals };
      Object.keys(resetValues).forEach((k) => {
         resetValues[k] = 0;
      });
      setTotals(resetValues);
   }

   useEffect(() => {
      async function setTickers() {
         try {
            let url = APITOTALTRADES;
            const response = await axios.get(url);
            if (response.data.length > 0) {
               const tickers = new Set(response.data.map((elem) => elem._id));
               setTickersList([...tickers]);
            }
         } catch (err) {
            console.log(err);
         }
      }
      loadTradesData();
      if (tickersList.length === 0) {
         setTickers();
      }
   }, [loadTradesData, tickersList]);

   return (
      <>
         <VStack alignItems={"flex-start"} spacing={2} pb={6}>
            <FilterTop
               tickers={tickersList}
               filters={filters}
               setFilters={setFilters}
            />
            <TopTotal
               value={totals.totalProfits}
               text="total Profits"
               type="value"
            />
            <CustomButton fontSize={"xs"} py={2}>
               Add new trade
            </CustomButton>
         </VStack>
         <VStack p={0} w="full" h="60vh" overflow={"scroll"} pb={10}>
            {tradesData.map((data, idx) => (
               <TradeCard key={idx} data={data} />
            ))}
            {pagination && pagination.hasNext && (
               <CustomButton
                  onClick={async () => {
                     const data = await getTradesData(pagination.page + 1);
                     setPagination(data.pagination);
                     setTradesData([...tradesData, ...data.results]);
                  }}
               >
                  Load More
               </CustomButton>
            )}
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
                  text="price"
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
                  <Text pl={4}>
                     {props.data.profits.percentage.toFixed(2)}%
                  </Text>
               </Flex>
            )}
         </VStack>
      </Box>
   );
};
