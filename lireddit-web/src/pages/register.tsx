import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/wrapper";
import InputField from "../components/input_field";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/to_error_map";

interface registerProps {}

const REGISTER_MUTATION = `
mutation Register($username:String!, $password:String!){
  register(options:{username:$username, password:$password}){
    errors{
      field
      message
    }
    user{
      id
      updatedAt
      createdAt
      username
    }
  }
}
`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          //return a promise, so hen it resolves, the loading spinner will stop
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button my={4} isLoading={isSubmitting} color="teal" type="submit">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

//in next have to export default the component
export default Register;
