import React, { useEffect, useState } from "react";
import { APIINCOMES } from "../../constants";
import axios from "axios";
import { CustomButton } from "../../components/Button/Button";
import {
   VStack,
   Drawer,
   DrawerBody,
   DrawerFooter,
   DrawerHeader,
   DrawerOverlay,
   DrawerContent,
   DrawerCloseButton,
   Input,
   Select,
   FormErrorMessage,
   FormControl,
   Alert,
   AlertIcon,
} from "@chakra-ui/react";

const AddIncome = (props) => {
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState();
   useEffect(() => {
      resetErrors();
   }, []);
   const resetErrors = () => {
      setErrors({
         date: undefined,
         ticker: undefined,
         value: undefined,
         category: undefined,
         general: undefined,
      });
   };

   const saveIncome = async (e) => {
      e.preventDefault();
      resetErrors();
      try {
         setIsLoading(true);
         var formData = new FormData(e.target);
         await axios.post(APIINCOMES, Object.fromEntries(formData));
         props.setIncomeDrawerStatus(false);
         props.loadIncomeData();
      } catch (err) {
         const newErrors = { ...errors };
         newErrors.general = "Could not save new income.";
         const validErrors = err.response?.data?.error;
         if (validErrors) {
            if (typeof validErrors === "object") {
               Object.keys(validErrors).forEach((k) => {
                  Object.assign(newErrors, { [k]: validErrors[k].join(", ") });
               });
            }
         }
         setErrors(newErrors);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Drawer
         isOpen={props.incomeDrawerStatus}
         placement="right"
         onClose={() => {
            props.setIncomeDrawerStatus(false);
         }}
      >
         <DrawerOverlay />
         <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Add new Income</DrawerHeader>

            <DrawerBody>
               <form onSubmit={saveIncome} name="formIncome" id="formIncome">
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
                     <FormControl isInvalid={errors?.value}>
                        <Input
                           placeholder="Amount R$"
                           type="number"
                           name="value"
                           step=".01"
                           required={true}
                        />
                        <FormErrorMessage>{errors?.value}</FormErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={errors?.category}>
                        <Select
                           placeholder="Select category"
                           name="category"
                           required={true}
                        >
                           <option value="INTERESTS">Interests</option>
                           <option value="DIVIDENDS">Dividends</option>
                        </Select>
                        <FormErrorMessage>{errors?.category}</FormErrorMessage>
                     </FormControl>
                  </VStack>
               </form>
            </DrawerBody>

            <DrawerFooter>
               <CustomButton
                  type="submit"
                  form="formIncome"
                  isLoading={isLoading}
                  mr={3}
               >
                  Save
               </CustomButton>
               <CustomButton
                  onClick={() => {
                     props.setIncomeDrawerStatus(false);
                  }}
               >
                  Cancel
               </CustomButton>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
};

export { AddIncome };
