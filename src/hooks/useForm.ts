import { useState, ChangeEvent } from "react";
import { parse, isValiError, flatten, BaseSchema, BaseIssue } from "valibot";

type ReactEvent = ChangeEvent<HTMLInputElement>;
type Schema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;
type FieldSchemas = Record<string, Schema>;
type InitialFormValues = Record<string, string | number>;
type FormValues = Record<keyof FieldSchemas, string | number>;
type FieldErrors = Record<keyof FieldSchemas, string>;

export const useForm = (
  formSchema: Schema,
  fieldSchemas: FieldSchemas,
  initialValues: InitialFormValues = {},
) => {
  const populatedInitialValues: FormValues = Object.keys(fieldSchemas).reduce(
    (acc, field) => ({ ...acc, [field]: initialValues[field] || "" }),
    {},
  );

  const [values, setValues] = useState(populatedInitialValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = (field: string) => (event: ReactEvent) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateField = (field: string) => () => {
    try {
      parse(fieldSchemas[field], values?.[field] ?? "");
    } catch (error) {
      if (!isValiError(error)) throw error;
      setErrors((prev) => ({ ...prev, [field]: error.message }));
    }
  };

  const validateForm = () => {
    try {
      parse(formSchema, values);
      return true;
    } catch (error) {
      if (!isValiError(error)) throw error;
      const { nested: errorsByField } = flatten(error.issues);
      const firstErrorByField: FieldErrors = Object.entries(
        errorsByField as Record<keyof FieldSchemas, [string]>,
      ).reduce(
        (acc, [field, errors]) => ({ ...acc, [field]: errors?.[0] ?? "" }),
        {},
      );
      setErrors(firstErrorByField);
      return false;
    }
  };

  return { values, errors, handleChange, validateField, validateForm };
};
