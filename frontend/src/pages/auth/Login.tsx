import { FaRegUser } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/use-auth";
import type { UserLoginForm } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { AppRoutes } from "../../routes";
import { authLogin } from "../../api/AuthApi";
import ErrorMessage from "../../component/styles/ErrorLabel";

export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useAuth();

  const initialValues: UserLoginForm = {
    email: "",
    password: ""
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: UserLoginForm) =>
      authLogin(formData, setCurrentUser),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      navigate(AppRoutes.home.route());
    }
  });

  const handleLogin = (data: UserLoginForm) => mutate(data);

  if (currentUser) return <Navigate to={AppRoutes.home.route()} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f6ef] p-6">

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-[#f3ead0] p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Agente de Stock
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Iniciá sesión para continuar
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative">
              <FaRegUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="tu@email.com"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email no válido"
                  }
                })}
                className="w-full pl-10 pr-4 py-3 border border-[#f3ead0] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              />
            </div>

            {errors.email && (
              <ErrorMessage bar={false}>
                {errors.email.message}
              </ErrorMessage>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <div className="relative">
              <MdOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es obligatoria"
                })}
                className="w-full pl-10 pr-4 py-3 border border-[#f3ead0] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              />
            </div>

            {errors.password && (
              <ErrorMessage bar={false}>
                {errors.password.message}
              </ErrorMessage>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right text-sm">
            <button
              type="button"
              className="text-orange-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition shadow-md disabled:opacity-50"
          >
            {isPending ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>
      </div>
    </div>
  );
}
