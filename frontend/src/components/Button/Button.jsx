import { Button } from "@chakra-ui/react";

export const CustomButton = (props) => {
   return (
      <Button
         variant={"outline"}
         borderColor="gray.400"
         color="gray.400"
         borderRadius={8}
         p={4}
         {...props}
      >
         {props.children}
      </Button>
   );
};
