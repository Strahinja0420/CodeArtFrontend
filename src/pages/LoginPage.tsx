import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/auth.service";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    console.log("Login form submitted:", { ...data, password: "***" });
    try {
      const response: any = await authService.login(data);
      console.log("Login response received:", response);

      // The backend wraps everything in a 'data' property via ResponseInterceptor
      const authData = response.data;

      if (authData && authData.access_token && authData.user) {
        login(authData.access_token, authData.user);
        navigate("/");
      } else {
        console.error(
          "Login response missing token or user in data:",
          response,
        );
        alert("Login failed: Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Invalid credentials";
      alert(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 rounded-3xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/30"
          >
            <LogIn className="text-accent" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">ArtNode</h1>
          <p className="text-fg/60">Cultural Navigation Dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-fg/10 flex flex-col gap-3">
          <div className="text-center text-sm text-fg/40 mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent cursor-pointer hover:underline font-semibold"
            >
              Register
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
