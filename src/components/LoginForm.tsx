import { KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router";
import {
  LoginSchema,
  EmailSchema,
  NameSchema,
} from "../services/validation.ts";
import { useAuthStore, User } from "../stores/auth.ts";
import { useForm } from "../hooks/useForm.ts";

const LoginForm = () => {
  const { values, errors, handleChange, validateForm, validateField } = useForm(
    LoginSchema,
    { name: NameSchema, email: EmailSchema },
  );

  const handleNameChange = handleChange("name");
  const handleEmailChange = handleChange("email");

  const validateName = validateField("name");
  const validateEmail = validateField("email");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;
    setIsLoading(true);
    await login(values as User);
    setIsLoading(false);
    await navigate("/");
  };

  const handleLoginClick = () => void handleLogin();

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    handleLoginClick();
  };

  return (
    <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
      <legend className="fieldset-legend">Login</legend>

      <div className="relative">
        <label className="fieldset-label">Name</label>
        <input
          type="text"
          className={`input w-full ${errors.name ? "border-error" : ""}`}
          placeholder="Name"
          onChange={handleNameChange}
          onBlur={validateName}
          onKeyDown={handleKeyPress}
        />
        {errors.name && (
          <span className="absolute left-0 top-full text-error text-sm mt-1">
            {errors.name}
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <label className="fieldset-label">Email</label>
        <input
          type="email"
          className={`input w-full ${errors.email ? "border-error" : ""}`}
          placeholder="Email"
          onChange={handleEmailChange}
          onBlur={validateEmail}
          onKeyDown={handleKeyPress}
        />
        {errors.email && (
          <span className="absolute left-0 top-full text-error text-sm mt-1">
            {errors.email}
          </span>
        )}
      </div>

      <button
        className="btn btn-neutral mt-6 w-full"
        disabled={Boolean(errors.email || errors.name || isLoading)}
        onClick={handleLoginClick}
      >
        {isLoading && <span className="loading loading-spinner" />}Login
      </button>
    </fieldset>
  );
};

export default LoginForm;
