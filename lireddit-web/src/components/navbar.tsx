import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface navbarProps {}

export const Navbar: React.FC<navbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  //data is loading
  if (fetching) {
    //no user is loged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
    //user is logged in
  } else {
    body = (
      <Flex>
        <Box color="white">{data.me.username}</Box>
        <Button ml={2} variant="link">
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p={4} ml={"auto"} justify={"flex-end"}>
      <Box>{body}</Box>
    </Flex>
  );
};
