import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

//to match the useFiled hook parameters
type registerProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

//rearanging the props object to pass it into input
const InputField: React.FC<registerProps> = ({ label, size: _, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
        {...props}
        {...field}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

//in next have to export default the component
export default InputField;
