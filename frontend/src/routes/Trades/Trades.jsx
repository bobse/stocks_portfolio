import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
   Box,
   HStack,
   Spacer,
   VStack,
   Text,
   Flex,
   Drawer,
   DrawerBody,
   DrawerFooter,
   DrawerHeader,
   DrawerOverlay,
   DrawerContent,
   DrawerCloseButton,
   Input,
   FormErrorMessage,
   FormControl,
   Alert,
   AlertIcon,
   Menu,
   MenuButton,
   MenuList,
   MenuItem,
   IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { ThreeDots } from "../../components/ThreeDots/ThreeDots";
import { Notes } from "../../components/Notes/Notes";
import { LabeledInfo } from "../../components/LabeledInfo/LabeledInfo";
import { TopTotal } from "../../components/TopTotal/TopTotal";
import { FilterTop } from "../../components/FilterTop/FilterTop";
import { dateFormatted } from "../../utils/utils";
import { APITRADES, APITOTALTRADES, APITRADESUPLOAD } from "../../constants";
import { CustomButton } from "../../components/Button/Button";
import { UploadCsv } from "../../components/UploadCsv/UploadCsv";

const totalsStartUp = { totalProfits: 0 };

export const Trades = (props) => {
   const [tradeDrawerStatus, setTradeDrawerStatus] = useState(false);
   const [uploadDrawerStatus, setUploadDrawerStatus] = useState(false);
   const [tradesData, setTradesData] = useState([]);
   const [totals, setTotals] = useState({
      ...totalsStartUp,
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
            setTotals({ ...totalsStartUp });
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
         <AddTrade
            setTradeDrawerStatus={setTradeDrawerStatus}
            tradeDrawerStatus={tradeDrawerStatus}
            loadTradesData={loadTradesData}
         />
         <UploadCsv
            setDrawerStatus={setUploadDrawerStatus}
            drawerStatus={uploadDrawerStatus}
            refreshCb={loadTradesData}
            apiUrl={APITRADESUPLOAD}
         />
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
            <CustomButton
               fontSize={"xs"}
               py={2}
               onClick={() => {
                  setTradeDrawerStatus(!tradeDrawerStatus);
               }}
            >
               Add new trade
            </CustomButton>
            <CustomButton
               fontSize={"xs"}
               py={2}
               onClick={() => {
                  setUploadDrawerStatus(!uploadDrawerStatus);
               }}
            >
               Import csv file
            </CustomButton>
         </VStack>
         <VStack p={0} w="full" h="60vh" overflow={"scroll"} pb={10}>
            {tradesData.map((data, idx) => (
               <TradeCard
                  key={idx}
                  data={data}
                  loadTradesData={loadTradesData}
               />
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
                     {props.data.notes && props.data.notes.length > 0 && (
                        <Notes>{props.data.notes}</Notes>
                     )}
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
               <MenuDelete
                  boxSize={5}
                  pt={1}
                  id={props.data._id}
                  loadTradesData={props.loadTradesData}
               />
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

const AddTrade = (props) => {
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState();
   useEffect(() => {
      resetErrors();
   }, []);
   const resetErrors = () => {
      setErrors({
         date: undefined,
         ticker: undefined,
         price: undefined,
         fees: undefined,
         amount: undefined,
         notes: undefined,
         general: undefined,
      });
   };
   const saveIncome = async (e) => {
      e.preventDefault();
      resetErrors();
      try {
         setIsLoading(true);
         var formData = new FormData(e.target);
         await axios.post(APITRADES, Object.fromEntries(formData));
         props.setTradeDrawerStatus(false);
         props.loadTradesData();
      } catch (err) {
         const newErrors = { ...errors };
         newErrors.general = "Could not save new trade.";
         const validErrors = err.response?.data?.error;
         if (validErrors) {
            if (typeof validErrors === "object") {
               Object.keys(validErrors).forEach((k) => {
                  Object.assign(newErrors, { [k]: validErrors[k].join(", ") });
               });
            } else if (typeof validErrors === "string") {
               newErrors.general = validErrors;
            }
         }
         setErrors(newErrors);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Drawer
         isOpen={props.tradeDrawerStatus}
         placement="right"
         onClose={() => {
            props.setTradeDrawerStatus(false);
         }}
      >
         <DrawerOverlay />
         <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Add new Trade</DrawerHeader>

            <DrawerBody>
               <form onSubmit={saveIncome} name="formTrade" id="formTrade">
                  <VStack>
                     {errors?.general && (
                        <Alert status="error">
                           <AlertIcon />
                           {errors.general}
                        </Alert>
                     )}
                     <FormControl isInvalid={errors?.date}>
                        <Input
                           placeholder="Date"
                           type="datetime-local"
                           name="date"
                           required={true}
                        />
                        <FormErrorMessage>{errors?.date}</FormErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={errors?.ticker}>
                        <Input
                           placeholder="Ticker Ie: PETR4"
                           type="text"
                           length="6"
                           name="ticker"
                           required={true}
                        />
                        <FormErrorMessage>{errors?.ticker}</FormErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={errors?.price}>
                        <Input
                           placeholder="Price R$"
                           type="number"
                           step=".01"
                           name="price"
                           required={true}
                        />
                        <FormErrorMessage>{errors?.price}</FormErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={errors?.fees}>
                        <Input
                           placeholder="Fees R$"
                           type="number"
                           name="fees"
                           step=".01"
                           required={true}
                        />
                        <FormErrorMessage>{errors?.fees}</FormErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={errors?.amount}>
                        <Input
                           placeholder="Amount"
                           type="number"
                           name="amount"
                           required={true}
                        />
                        <FormErrorMessage>{errors?.amount}</FormErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={errors?.notes}>
                        <Input
                           placeholder="Extra notes"
                           type="text"
                           length="100"
                           name="notes"
                           required={false}
                        />
                        <FormErrorMessage>{errors?.ticker}</FormErrorMessage>
                     </FormControl>
                  </VStack>
               </form>
            </DrawerBody>

            <DrawerFooter>
               <CustomButton
                  type="submit"
                  form="formTrade"
                  isLoading={isLoading}
                  mr={3}
               >
                  Save
               </CustomButton>
               <CustomButton
                  onClick={() => {
                     props.setTradeDrawerStatus(false);
                  }}
               >
                  Cancel
               </CustomButton>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
};

const MenuDelete = (props) => {
   const deleteIncome = async (id) => {
      const data = { data: { _id: id } };
      await axios.delete(APITRADES, data);
      props.loadTradesData();
   };
   return (
      <Menu>
         <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<ThreeDots />}
            border={"none"}
            color="gray.100"
            variant="outline"
         />
         <MenuList>
            <MenuItem
               onClick={() => {
                  deleteIncome(props.id);
               }}
               icon={<DeleteIcon />}
            >
               Delete
            </MenuItem>
         </MenuList>
      </Menu>
   );
};
