import { Box } from "@chakra-ui/react";
import React from "react";
interface registerProps {
  varient?: "small" | "regular";
}

const Wrapper: React.FC<registerProps> = ({
  children,
  varient = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={varient === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};

//in next have to export default the component
export default Wrapper;
