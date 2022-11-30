import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, HStack, VStack, Text, Flex, Button } from "@chakra-ui/react";
import { ThreeDots } from "../../components/ThreeDots/ThreeDots";
import { TopTotal } from "../../components/TopTotal/TopTotal";
import { FilterTop } from "../../components/FilterTop/FilterTop";
import { dateFormatted } from "../../utils/utils";
import { APIINCOMES, APITOTALINCOMES } from "../../constants";
import { useCallback } from "react";
import { CustomButton } from "../../components/Button/Button";

export const Incomes = (props) => {
   const [incomesData, setIncomesData] = useState([]);
   const [totals, setTotals] = useState({
      totalIncome: 0,
      totalInterests: 0,
      totalDividends: 0,
   });
   const [pagination, setPagination] = useState();
   const [filters, setFilters] = useState({
      ticker: "all",
      year: "all",
      category: "all",
   });
   const [tickersList, setTickersList] = useState([]);

   const getIncomeData = useCallback(
      async (page = 1, limit = 50) => {
         let url = APIINCOMES;
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

   const loadIncomeData = useCallback(async () => {
      function resetTotals() {
         const resetValues = { ...totals };
         Object.keys(resetValues).forEach((k) => {
            resetValues[k] = 0;
         });
         setTotals(resetValues);
      }
      const updateTotals = async () => {
         let url = APITOTALINCOMES;
         url += `/${filters.year}`;
         if (filters.ticker !== "all") url += `/${filters.ticker}`;
         const response = await axios.get(url);
         if (response.data.length > 0) {
            const totalInterests = response.data.reduce((prev, elem) => {
               return elem.totalInterests + prev;
            }, 0);
            const totalDividends = response.data.reduce((prev, elem) => {
               return elem.totalDividends + prev;
            }, 0);
            const totalIncome = totalDividends + totalInterests;
            setTotals({ totalIncome, totalDividends, totalInterests });
         } else {
            resetTotals();
         }
      };
      try {
         const data = await getIncomeData();
         if (data) {
            setIncomesData(data.results);
            setPagination(data.pagination);
         }
         updateTotals();
      } catch (err) {
         console.log(err);
      }
   }, [filters, getIncomeData, totals]);

   useEffect(() => {
      async function setTickers() {
         try {
            let url = APITOTALINCOMES;
            const response = await axios.get(url);
            if (response.data.length > 0) {
               const tickers = new Set(response.data.map((elem) => elem._id));
               setTickersList([...tickers]);
            }
         } catch (err) {
            console.log(err);
         }
      }
      loadIncomeData();
      if (tickersList.length === 0) {
         setTickers();
      }
   }, [loadIncomeData, tickersList]);

   function changeCatFilter(cat) {
      const newValues = { ...filters };
      newValues.category = cat.toUpperCase();
      setFilters(newValues);
   }

   return (
      <>
         <VStack alignItems={"flex-start"} spacing={2} pb={2} w="full">
            <FilterTop
               tickers={tickersList}
               filters={filters}
               setFilters={setFilters}
            />
            <Flex mb={4}>
               <TopTotal
                  value={totals.totalIncome}
                  text="total income"
                  type="value"
               />
               <TopTotal
                  value={totals.totalDividends}
                  text="total dividends"
                  type="value"
               />
               <TopTotal
                  value={totals.totalInterests}
                  text="total Interests"
                  type="value"
               />
            </Flex>
            <CustomButton fontSize={"xs"} py={2}>
               Add new income
            </CustomButton>
            <HStack w="full" spacing={2} pt={6}>
               <FilterButton
                  isActive={filters.category.toUpperCase() === "ALL"}
                  onClick={() => {
                     changeCatFilter("all");
                  }}
               >
                  ALL
               </FilterButton>
               <FilterButton
                  isActive={filters.category.toUpperCase() === "DIVIDENDS"}
                  onClick={() => {
                     changeCatFilter("dividends");
                  }}
               >
                  Dividends
               </FilterButton>
               <FilterButton
                  isActive={filters.category.toUpperCase() === "INTERESTS"}
                  onClick={() => {
                     changeCatFilter("interests");
                  }}
               >
                  interests
               </FilterButton>
            </HStack>
         </VStack>

         <VStack w="full" h="48vh" overflow={"scroll"} pb={10}>
            {incomesData.map((data, idx) => (
               <IncomeCard key={idx} data={data} />
            ))}
            {pagination && pagination.hasNext && (
               <CustomButton
                  onClick={async () => {
                     const data = await getIncomeData(pagination.page + 1);
                     setPagination(data.pagination);
                     setIncomesData([...incomesData, ...data.results]);
                  }}
               >
                  Load More
               </CustomButton>
            )}
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
                     <Text
                        fontSize={"xs"}
                        color={
                           props.data.category.toLowerCase() === "interests"
                              ? "teal.700"
                              : "green.400"
                        }
                        mt={-1}
                     >
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
