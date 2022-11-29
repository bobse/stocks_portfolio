import { Box, Flex, Select } from "@chakra-ui/react";
const getTickers = () => {
   return ["PETR4", "VALE5", "AESB3"];
};
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
            defaultValue={props.year}
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
            defaultValue={props.ticker}
         >
            <option value="all">All</option>
            {getTickers().map((elem) => (
               <option key={elem} value={elem}>
                  {elem}
               </option>
            ))}
         </Select>
      </Flex>
   );
};
