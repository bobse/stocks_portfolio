import React, { useEffect, useState } from "react";
import axios from "axios";
import { CustomButton } from "../Button/Button";
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
   Alert,
   AlertIcon,
} from "@chakra-ui/react";

const UploadCsv = ({ setDrawerStatus, drawerStatus, refreshCb, apiUrl }) => {
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState();
   useEffect(() => {
      resetErrors();
   }, []);
   const resetErrors = () => {
      setErrors({
         general: undefined,
      });
   };

   const saveCsv = async (e) => {
      e.preventDefault();
      resetErrors();
      try {
         setIsLoading(true);
         var formData = Object.fromEntries(new FormData(e.target));
         e.target.reset();
         const res = await axios.post(apiUrl, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
         if (
            res.data?.invalidLinesinFile &&
            res.data.invalidLinesinFile.length > 0
         ) {
            setErrors({
               general: `The following line numbers in file are invalid and were not saved: ${res.data.invalidLinesinFile.join(
                  ", "
               )}`,
            });
         } else {
            setDrawerStatus(false);
         }
         refreshCb();
      } catch (err) {
         const newErrors = { ...errors };
         newErrors.general =
            "Could not load this file. Please follow the instructions on how to prepare the file.";
         if (err.response.data?.error) {
            newErrors.general = err.response.data?.error;
         }
         setErrors(newErrors);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Drawer
         isOpen={drawerStatus}
         placement="right"
         onClose={() => {
            setDrawerStatus(false);
         }}
      >
         <DrawerOverlay />
         <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Import CSV file</DrawerHeader>

            <DrawerBody>
               <form
                  onSubmit={saveCsv}
                  name="form"
                  id="form"
                  encType="multipart/form-data"
               >
                  <VStack>
                     {errors?.general && (
                        <Alert status="error">
                           <AlertIcon />
                           {errors.general}
                        </Alert>
                     )}
                     <Input
                        type="file"
                        name="csv_file"
                        multiple={false}
                        required={true}
                        p={2}
                        bg={"none"}
                        border={"none"}
                     />
                  </VStack>
               </form>
            </DrawerBody>

            <DrawerFooter>
               <CustomButton
                  type="submit"
                  form="form"
                  isLoading={isLoading}
                  mr={3}
               >
                  Upload
               </CustomButton>
               <CustomButton
                  onClick={() => {
                     setDrawerStatus(false);
                  }}
               >
                  Cancel
               </CustomButton>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
};

export { UploadCsv };
