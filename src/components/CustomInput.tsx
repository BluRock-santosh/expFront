import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface CustomInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>; 
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: string;
}

function CustomInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
}: CustomInputProps<T>) {
  return (
    <div className="space-y-1">
      <label htmlFor={String(name)} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={String(name)}
        type={type}
        placeholder={placeholder}
        {...register(name)} // `name` now works with Path<T>
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded focus:outline-none focus:ring-2 focus:ring-primary`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default CustomInput;
