import { useState } from "react";

export default function useFormHandler() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  //  Regular Expressions
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  //  Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Validation Function
  const validate = () => {
    const newErrors = {};

    if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address.";

    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must be at least 8 chars, include uppercase, lowercase, and a number.";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!");
      console.log(formData);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
  };
}
