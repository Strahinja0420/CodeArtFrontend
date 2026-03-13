import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/auth.service";
import { useAuth } from "../context/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response: any = await authService.register(data);
      if (response.access_token) {
        login(response.access_token, response.user);
        navigate("/");
      } else {
        alert("Account created successfully! Please log in.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-lg p-8 rounded-3xl"
      >
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-fg/40 hover:text-fg transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/30"
          >
            <UserPlus className="text-accent" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Join ArtNode</h1>
          <p className="text-fg/60">
            Digitize and preserve cultural heritage
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">
              Full Name
            </label>
            <input
              {...register("name")}
              className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div></div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors"
              placeholder="museum@curator.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full bg-fg/5 border border-fg/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-xl mt-4 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

      </motion.div>
    </div>
  );
};

export default RegisterPage;
