import { FieldError } from "../generated/graphql";

// a util function that convert the server error format to formik error format
export const toErrorMap = (errors: FieldError[]) => {
  const errorsMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorsMap[field] = message;
  });

  return errorsMap;
};
