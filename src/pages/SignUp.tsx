import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../components/CustomInput"; // Import CustomInput
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { backendUrl } from "./Login";

// Zod schema for validation with password confirmation check using superRefine
const SignUpSchema = z
  .object({
    username: z.string().nonempty("Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"], // You can specify the field here
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

// Define the type for form data
type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  // Form submission handler
  const onSubmitHandler: SubmitHandler<SignUpFormData> = async (
    data: SignUpFormData
  ) => {
    const { confirmPassword, ...userInfo } = data;
    // Add user info to the database
    try {
      const res = await fetch(`${backendUrl}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const responseData = await res.json();
      if (responseData.success === "true") {
        navigate(`/?email=${encodeURIComponent(data.email)}`, {
          replace: true,
        });
      } else {
        toast.error("Failed to sign up");
      }
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-md bg-background p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>
        <form
          className="space-y-4"
          onSubmit={handleFormSubmit(onSubmitHandler)}
        >
          <CustomInput
            label="Username"
            name="username"
            placeholder="Enter your username"
            register={register}
            error={errors.username?.message}
          />
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
          <CustomInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            register={register}
            error={errors.confirmPassword?.message}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
