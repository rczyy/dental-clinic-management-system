import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiAtSign } from "react-icons/fi";
import * as yup from "yup";
import FormInput from "../components/FormInput";
import { Link } from "react-router-dom";

type Props = {};

const schema = yup
  .object({
    firstName: yup.string().required("First Name is required"),
    middleName: yup.string().required("Middle Name is required"),
    lastName: yup.string().required("Last Name is required"),
    region: yup.string().required("Region is required"),
    province: yup.string().required("Province is required"),
    city: yup.string().required("City is required"),
    barangay: yup.string().required("Barangay is required"),
    street: yup.string().required("Street is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm your Password")
      .oneOf([yup.ref("password")], "Passwords must match"),
    contactNo: yup
      .string()
      .required("Contact Number is required")
      .min(10, "Invalid phone number")
      .max(10, "Invalid phone number"),
  })
  .required();

const Signup = (props: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupValues> = (data) => console.log(data);

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
              <h1 className="text-4xl font-bold">Sign Up</h1>
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
                label="firstName"
                placeholder="First Name"
                register={register}
                value={watch("firstName")}
                error={errors.firstName?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="middleName"
                placeholder="Middle Name"
                register={register}
                value={watch("middleName")}
                error={errors.middleName?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="lastName"
                placeholder="Last Name"
                register={register}
                value={watch("lastName")}
                error={errors.lastName?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="region"
                placeholder="Region"
                register={register}
                value={watch("region")}
                error={errors.region?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="province"
                placeholder="Province"
                register={register}
                value={watch("province")}
                error={errors.province?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="city"
                placeholder="City"
                register={register}
                value={watch("city")}
                error={errors.city?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="barangay"
                placeholder="Barangay"
                register={register}
                value={watch("barangay")}
                error={errors.barangay?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="street"
                placeholder="Street"
                register={register}
                value={watch("street")}
                error={errors.street?.message}
                Logo={FiAtSign}
              />
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
              <FormInput
                type="text"
                label="confirmPassword"
                placeholder="Confirm Password"
                register={register}
                value={watch("confirmPassword")}
                error={errors.confirmPassword?.message}
                Logo={FiAtSign}
              />
              <FormInput
                type="text"
                label="contactNo"
                placeholder="Contact Number"
                register={register}
                value={watch("contactNo")}
                error={errors.contactNo?.message}
                Logo={FiAtSign}
              />
              <a className="text-xs text-neutral ml-auto">Forgot Password</a>
              <button
                type="submit"
                className="btn bg-primary border-primary text-zinc-50 my-8"
              >
                Log In
              </button>
            </form>
          </div>
          <footer className="text-center text-sm absolute bottom-0 p-4">
            <p>
              Already have an account?{" "}
              <Link to="login" className="text-primary">
                Log in
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Signup;
