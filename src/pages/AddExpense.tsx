import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import CustomInput from "../components/CustomInput"; // Import your CustomInput
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { backendUrl } from "./Login";
import { useNavigate } from "react-router-dom";


// Define the validation schema for the expense form
const ExpenseSchema = z.object({
  name: z.string().nonempty("Expense name is required"),
  amount: z.string().min(0.01, "Amount must be greater than 0"),
  category: z.string().nonempty("Category is required"),
  date: z.string().nonempty("Date is required"),
});

type ExpenseFormData = {
  name: string;
  amount: string;
  category: string;
  date: string;
};


const AddExpense = () => {

  const navigate = useNavigate();
  // Initialize form methods
  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      date: today, // Default amount to "0" (string)
    },
  });

  // Handle form submission
  const onSubmitHandler: SubmitHandler<ExpenseFormData> = async (data) => {
    try {
      const res = await fetch(`${backendUrl}/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log(result);
      

      if (!result.success) {
        toast.error(result.message);
        if (result.message==="Token has expired, please log in again.") {
          navigate("/")
        }
          
        return;
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
      return;
    }

    toast.success("Expense added successfully");
    onAddExpense(data);
  };

  return (
    <div className="justify-center ">
      <h2 className="text-2xl lg:text-4xl text-center font-bold mb-4">
        Add New Expense
      </h2>
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 md:w-2/3 w-full py-10 border  p-4 rounded-sm"
        >
          <CustomInput
            label="Expense Name"
            name="name"
            placeholder="Enter expense name"
            register={register}
            error={errors.name?.message}
          />
          <CustomInput
            label="Amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            register={register}
            error={errors.amount?.message}
          />
          <CustomInput
            label="Category"
            name="category"
            placeholder="Enter category"
            register={register}
            error={errors.category?.message}
          />
          <CustomInput
            label="Date"
            name="date"
            type="date"
            register={register}
            error={errors.date?.message}
          />
          <Button type="submit" className="w-full mt-4">
            Add Expense
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
