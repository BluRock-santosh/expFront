import { Input as ShadcnInput } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UseFormRegister, FieldValues, FieldError } from "react-hook-form";

interface CustomInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  register: UseFormRegister<FieldValues>; 
  error?: string | FieldError | undefined; 
}

const CustomInput = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
}: CustomInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <ShadcnInput
        id={name}
        type={type}
        placeholder={placeholder}
        {...(register ? register(name) : {})} 
        className={`${
          error ? 'border-red-500' : 'border-gray-300'
        } border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`} // Adding styles for error state
      />
      {error && (
        <p className="text-sm text-red-500">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </div>
  );
};

export default CustomInput;
