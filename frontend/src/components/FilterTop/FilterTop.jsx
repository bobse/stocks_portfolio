import { Box, Flex, Select } from "@chakra-ui/react";

export const FilterTop = (props) => {
   const years = [...Array(30).keys()].map(
      (elem) => new Date().getFullYear() - elem
   );

   return (
      <Flex alignItems={"flex-start"} wrap="wrap">
         <Select
            _hover={{ color: "green.400" }}
            size={"sm"}
            border="0"
            icon={"none"}
            ml={-3}
            _focusVisible={false}
            defaultValue={props.filters.year}
            onChange={(e) => {
               const newValues = { ...props.filters };
               newValues.year = e.target.value;
               props.setFilters(newValues);
            }}
         >
            <option value="all">All</option>
            {years.map((elem) => (
               <option key={elem} value={elem}>
                  {elem}
               </option>
            ))}
         </Select>
         <Select
            _hover={{ color: "green.400" }}
            fontSize={"2xl"}
            ml={-4}
            border="0"
            fontWeight="bold"
            icon={"none"}
            _focusVisible={false}
            defaultValue={props.filters.ticker}
            onChange={(e) => {
               const newValues = { ...props.filters };
               newValues.ticker = e.target.value;
               props.setFilters(newValues);
            }}
         >
            <option value="all">All</option>
            {props.tickers.map((elem) => (
               <option key={elem} value={elem}>
                  {elem}
               </option>
            ))}
         </Select>
      </Flex>
   );
};
