import { useForm, SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiAtSign } from "react-icons/fi";
import { useGetMe, useLogin } from "../hooks/user";
import * as z from "zod";
import FormInput from "../components/Form/FormInput";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginWithGoogle } from "../hooks/oauth";

type Props = {};

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

const Login = (props: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useGetMe();
  const { mutate, error, isLoading: loginLoading } = useLogin();
  const { mutate: loginWithGoogle } = useLoginWithGoogle();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) =>
    mutate(data, {
      onSuccess: (data) => {
        queryClient.setQueryData(["me"], data.user);
        navigate("/");
      },
    });

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: ({ code }) => {
      loginWithGoogle(code);
    },
  });

  if (data) return <Navigate to="/" />;

  return (
    <main className="flex items-center justify-center">
      <div className="flex bg-base-300 max-w-screen-lg w-full min-h-[40rem] rounded-box border border-base-200 shadow">
        <section className="bg-base-300 w-1/2 rounded-box overflow-hidden hidden sm:block">
          <img
            src="https://picsum.photos/2000"
            alt="Random"
            className="w-full h-full object-cover"
          />
        </section>
        <section className="bg-base-300 flex w-full sm:w-1/2 justify-center items-center rounded-box px-8 py-16 lg:px-20 relative">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-4 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-xs text-zinc-400">
                Sign in to access your personalized account and avail our dental
                services here at AT Dental Home.
              </p>
            </header>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormInput
                type="text"
                label="email"
                placeholder="Email"
                register={register}
                value={watch("email")}
                error={errors.email?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="password"
                label="password"
                placeholder="Password"
                register={register}
                value={watch("password")}
                error={errors.password?.message}
              />
              <Link
                to="/forgot-password"
                className="text-xs text-zinc-400 ml-auto transition duration-100 hover:text-zinc-600"
              >
                Forgot Password
              </Link>
              <div className="flex flex-col items-center my-8 gap-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full min-h-[2.5rem] h-10 border-primary text-zinc-50 normal-case"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </button>
                <button
                  type="button"
                  className="btn flex items-center gap-2 bg-zinc-800 w-full min-h-[2.5rem] h-10 normal-case text-zinc-50 hover:bg-zinc-700"
                  onClick={() => googleLogin()}
                >
                  <FcGoogle className="w-6 h-6" />
                  Continue with Google
                </button>
              </div>
              <span className="text-xs text-error text-center pl-1">
                {error && (error as any).response.data.formErrors}
              </span>
            </form>
          </div>
          <footer className="text-center text-sm absolute bottom-0 p-4">
            <p>
              Don't have an account yet?{" "}
              <Link to="/signup" className="text-primary">
                Sign Up
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
};
export default Login;
