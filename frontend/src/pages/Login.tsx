import FormInput from "../components/FormInput";

type Props = {};

const Login = (props: Props) => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white flex justify-center text-zinc-800 w-96 p-16 rounded-box shadow relative">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-bold">Login</h1>
            <p className="text-sm text-zinc-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
              sapiente.
            </p>
          </header>
          <form action="" className="flex flex-col gap-4">
            <FormInput />
            <FormInput />
            <FormInput />
            <FormInput />
            <FormInput />
            <FormInput />
            <button type="submit" className="btn mt-8">
              Log In
            </button>
          </form>
        </div>
        <footer className="text-center text-sm text-zinc-800 absolute bottom-0 p-4">
          <p>
            Don't have an account yet? <a>Sign Up</a>
          </p>
        </footer>
      </div>
    </main>
  );
};
export default Login;
