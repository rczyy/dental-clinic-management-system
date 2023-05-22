import { SubmitHandler, useForm } from "react-hook-form";
import { useResetPassword } from "../hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../components/Form/FormInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {}

const schema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be atleast 6 characters"),
    confirmPassword: z.string({ required_error: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"],
  });

export const ResetPassword = (_: Props): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate, error, isLoading } = useResetPassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) =>
    mutate(
      { token: searchParams.get("token") || "", ...data },
      {
        onSuccess() {
          navigate("/login");
        },
      }
    );

  if (!searchParams.get("token")) {
    throw new Response("Not Found", { status: 404 });
  }

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
              <h1 className="text-3xl font-bold">Create new password</h1>
              <p className="text-xs text-zinc-400">
                Your new password must be different from previous used
                passwords.
              </p>
            </header>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormInput
                type="password"
                label="password"
                placeholder="Password"
                register={register}
                value={watch("password")}
                error={errors.password?.message}
              />
              <FormInput
                type="password"
                label="confirmPassword"
                placeholder="Confirm Password"
                register={register}
                value={watch("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
              <button
                type="submit"
                className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 my-8 normal-case"
                disabled={isLoading}
              >
                {isLoading ? (
                  <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
              <span className="text-xs text-error text-center pl-1">
                {error && error.response.data.message}
              </span>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};
