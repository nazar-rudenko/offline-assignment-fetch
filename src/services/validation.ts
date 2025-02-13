import { pipe, strictObject, string, email, minLength } from "valibot";

export const NameSchema = pipe(
  string("No name provided"),
  minLength(5, "Name must be at least 5 characters"),
);
export const EmailSchema = pipe(
  string("No email provided"),
  email("Must be a valid email"),
);

export const LoginSchema = strictObject({
  name: NameSchema,
  email: EmailSchema,
});
