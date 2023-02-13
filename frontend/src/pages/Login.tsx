import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiAtSign } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import * as yup from "yup";
import FormInput from "../components/FormInput";
import { useGetUser, useLogin } from "../hooks/user";

type Props = {};

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

const Login = (props: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { data, isLoading } = useGetUser();
  const {mutate, error} = useLogin();

  const onSubmit: SubmitHandler<FormValues> = (data) =>
    mutate(data);

  if (isLoading) return <h2>Loading...</h2>;
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
              <h1 className="text-4xl font-bold">Login</h1>
              <p className="text-sm text-neutral">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
                sapiente.
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
              <a className="text-xs text-neutral ml-auto">Forgot Password</a>
              <button
                type="submit" 
                className="btn bg-primary border-primary text-zinc-50 my-8"
              >
                Log In
              </button>
              <span className="text-xs text-error text-center pl-1">
                {error &&
                  (error as any).response.data.formErrors}
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
