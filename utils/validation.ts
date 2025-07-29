// src/features/auth/utils/validationSchemas.ts
import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

