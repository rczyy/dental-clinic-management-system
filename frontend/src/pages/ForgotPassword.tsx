import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "../components/Form/FormInput";
import { FiArrowLeft, FiAtSign } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useRequestResetPassword } from "../hooks/email";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoMailRead } from "react-icons/go";

interface Props {}

export const ForgotPassword = (_: Props): JSX.Element => {
  const schema = z.object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ email: string }>({ resolver: zodResolver(schema) });

  const { mutate, isLoading, data, error, reset } = useRequestResetPassword();

  const onSubmit: SubmitHandler<{ email: string }> = (data) =>
    mutate(data.email);

  return (
    <main className="flex items-center justify-center">
      {data ? (
        <div className="flex bg-base-300 max-w-md w-full min-h-[40rem] rounded-box border border-base-200 shadow">
          <section className="flex flex-col justify-center items-center w-full p-8 gap-8">
            <div className="bg-base-100 p-6 rounded-box">
              <GoMailRead className="w-20 h-20 text-primary" />
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <h3 className="text-2xl font-bold">Check your mail</h3>
              <p className="text-zinc-500">
                We have sent a password recover instructions to your email.
              </p>
            </div>
            <Link to="/login">
              <button className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 normal-case">
                Go back to log in
              </button>
            </Link>
            <p className="text-sm text-zinc-500 text-center">
              Did not receive the email? Check your spam filter, or{" "}
              <span
                className="text-primary transtion duration-100 cursor-pointer hover:text-opacity-80"
                onClick={reset}
              >
                try another email address
              </span>
            </p>
          </section>
        </div>
      ) : (
        <div className="flex bg-base-300 max-w-screen-lg w-full min-h-[40rem] rounded-box border border-base-200 shadow">
          <section className="bg-base-300 w-1/2 rounded-box overflow-hidden hidden sm:block">
            <img
              src="https://picsum.photos/2000"
              alt="Random"
              className="w-full h-full object-cover"
            />
          </section>
          <section className="bg-base-300 flex w-full sm:w-1/2 justify-center items-center rounded-box px-8 py-16 lg:px-20 relative">
            <div className="flex flex-col gap-12">
              <header className="flex flex-col gap-4 text-center">
                <h1 className="text-3xl font-bold">Forgot password?</h1>
                <p className="text-xs text-zinc-400">
                  No worries. Enter the email associated with your account and
                  we'll send an email with instructions to reset your password.
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
                <div className="flex flex-col gap-4 my-8">
                  <button
                    type="submit"
                    className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 normal-case"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                    ) : (
                      "Reset password"
                    )}
                  </button>
                  <Link
                    to="/login"
                    className="group flex justify-center items-center gap-2"
                  >
                    <FiArrowLeft className="text-sm transition duration-100 group-hover:text-zinc-400" />
                    <span className="text-sm transition duration-100 group-hover:text-zinc-400">
                      Back to log in
                    </span>
                  </Link>
                </div>
                <span className="text-xs text-error text-center pl-1">
                  {error ? error.response.data.message : "\u00A0"}
                </span>
              </form>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};
