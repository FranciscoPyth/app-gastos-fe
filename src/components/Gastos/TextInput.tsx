import React from "react";

interface TextInputProps {
  label: string;
  id: string;
  type: "text" | "number";
  placeholder?: string;
  register: any;
  validation?: any;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  type,
  placeholder = "",
  register,
  validation,
  error,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={id}
        placeholder={placeholder}
        {...register(id, validation)}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default TextInput;