import React from "react";

interface SelectInputProps {
  label: string;
  id: string;
  options: { id: number; descripcion: string }[];
  register: any;
  required?: boolean;
  onAddClick: () => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  id,
  options,
  register,
  required = false,
  onAddClick,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="d-flex">
        <select className="form-select me-2" id={id} {...register(id, { required })}>
          <option value="">Selecciona {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.descripcion}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-outline-primary" onClick={onAddClick}>
          +
        </button>
      </div>
    </div>
  );
};

export default SelectInput;
