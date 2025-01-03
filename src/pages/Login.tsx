import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import CustomInput from "../components/CustomInput"; // Import the custom input
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";


// Zod schema for validation
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

export const backendUrl = "https://expensetracker-5c54.onrender.com";

// Define the type for the form data
type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  

  // Use the correct type for useForm
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: email || "", // Default to empty string if email is null
    },
    resolver: zodResolver(LoginSchema),
  });

  const navigate = useNavigate();

  // Specify the correct type for the data parameter
  const onSubmitHandler: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      

      // Handle successful login
      if ( responseData.success) {
        toast.success(responseData.message);
        localStorage.setItem("accessToken", responseData.token);
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(responseData.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-md bg-background p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <form
          className="space-y-4"
          onSubmit={handleFormSubmit(onSubmitHandler)}
        >
          <CustomInput
            label="Email"
            name="email"
            placeholder="Enter your email"
            register={register}
            error={errors.email?.message}
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            register={register}
            error={errors.password?.message}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don’t have an account?{" "}
          <Link to="/signUp" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
