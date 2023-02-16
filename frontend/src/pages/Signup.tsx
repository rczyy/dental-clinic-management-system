import { useState, useEffect, useRef } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  UseFormRegister,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiAtSign } from "react-icons/fi";
import { BsPerson, BsHouseDoor } from "react-icons/bs";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRegisterPatient } from "../hooks/patient";
import {
  getCities,
  getProvinces,
  getRegions,
  getBarangays,
} from "../api/philippineAddress";
import * as yup from "yup";
import Select from "react-select";
import FormInput from "../components/FormInput";
import { useGetUser } from "../hooks/user";

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
      .oneOf([yup.ref("password")], "Passwords doesn't match"),
    contactNo: yup
      .string()
      .required("Invalid contact number")
      .min(10, "Invalid contact number")
      .max(10, "Invalid contact number"),
  })
  .required();

const Signup = (props: Props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [regions, setRegions] = useState<Region[]>();
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>();
  const [provinces, setProvinces] = useState<Province[]>();
  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>();
  const [cities, setCities] = useState<City[]>();
  const [cityOptions, setCityOptions] = useState<SelectOption[]>();
  const [barangays, setBarangays] = useState<Barangay[]>();
  const [barangayOptions, setBarangayOptions] = useState<SelectOption[]>();
  const oldRegionValue = useRef<string>();
  const oldProvinceValue = useRef<string>();
  const oldCityValue = useRef<string>();

  const { data, isLoading } = useGetUser();
  const { mutate, error } = useRegisterPatient();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      contactNo: "",
      region: "",
      province: "",
      city: "",
      barangay: "",
      street: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    mutate(
      { ...data, contactNo: "+63" + watch("contactNo") },
      {
        onSuccess: () => navigate("/login"),
      }
    );
  };

  useEffect(() => {
    const getOptions = async () => {
      if (!regions) {
        const res = await getRegions();

        setRegions(res);
      } else {
        if (!regionOptions) {
          setRegionOptions(
            regions.map((region) => ({
              value: region.name,
              label: region.name,
            }))
          );
        }
      }

      if (
        watch("region") !== oldRegionValue.current &&
        watch("region") !== ""
      ) {
        oldRegionValue.current = watch("region");
        reset(
          (formValues) => ({
            ...formValues,
            province: "",
            city: "",
            barangay: "",
          }),
          { keepErrors: true }
        );

        if (regions) {
          const selectedRegion = regions.find(
            (region) => region.name === watch("region")
          );
          const regionCode = selectedRegion ? selectedRegion.code : "";
          const res = await getProvinces(regionCode);

          setProvinces(res);
          setProvinceOptions(
            res.map((province) => ({
              value: province.name,
              label: province.name,
            }))
          );
          setCityOptions(undefined);
          setBarangayOptions(undefined);
        }
      }

      if (
        watch("province") !== oldProvinceValue.current &&
        watch("province") !== ""
      ) {
        oldProvinceValue.current = watch("province");
        reset(
          (formValues) => ({
            ...formValues,
            city: "",
            barangay: "",
          }),
          { keepErrors: true }
        );

        if (provinces) {
          const selectedProvince = provinces.find(
            (province) => province.name === watch("province")
          );
          const provinceCode = selectedProvince ? selectedProvince.code : "";
          const res = await getCities(provinceCode);

          setCities(res);
          setCityOptions(
            res.map((city) => ({
              value: city.name,
              label: city.name,
            }))
          );
          setBarangayOptions(undefined);
        }
      }

      if (watch("city") !== oldCityValue.current && watch("city") !== "") {
        oldCityValue.current = watch("city");
        reset(
          (formValues) => ({
            ...formValues,
            barangay: "",
          }),
          { keepErrors: true }
        );

        if (cities) {
          const selectedCity = cities.find(
            (city) => city.name === watch("city")
          );
          const cityCode = selectedCity ? selectedCity.code : "";
          const res = await getBarangays(cityCode);

          setBarangays(res);
          setBarangayOptions(
            res.map((barangay) => ({
              value: barangay.name,
              label: barangay.name,
            }))
          );
        }
      }
    };

    getOptions();
  }, [regions, watch("region"), watch("province"), watch("city")]);

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
              <ul className="steps mb-8">
                <li
                  className={"step step-primary text-xs after:!text-zinc-100"}
                >
                  Personal details
                </li>
                <li
                  className={
                    "step text-xs after:!text-zinc-100 " +
                    (step >= 2
                      ? "step-primary"
                      : "before:!bg-neutral after:!bg-neutral")
                  }
                >
                  Address details
                </li>
                <li
                  className={
                    "step text-xs after:!text-zinc-100 " +
                    (step >= 3
                      ? "step-primary"
                      : "before:!bg-neutral after:!bg-neutral")
                  }
                >
                  Account details
                </li>
              </ul>
              <h1 className="text-4xl font-bold">
                {step === 1
                  ? "Personal details"
                  : step === 2
                  ? "Address details"
                  : "Account details"}
              </h1>
              <p className="text-sm text-neutral">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
                sapiente.
              </p>
            </header>
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <FormInput
                    type="text"
                    label="firstName"
                    placeholder="First Name"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("firstName")}
                    error={errors.firstName?.message}
                    Logo={BsPerson}
                  />
                  <FormInput
                    type="text"
                    label="middleName"
                    placeholder="Middle Name"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("middleName")}
                    error={errors.middleName?.message}
                    Logo={BsPerson}
                  />
                  <FormInput
                    type="text"
                    label="lastName"
                    placeholder="Last Name"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("lastName")}
                    error={errors.lastName?.message}
                    Logo={BsPerson}
                  />
                  <FormInput
                    type="number"
                    inputMode="numeric"
                    label="contactNo"
                    placeholder="Contact Number"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("contactNo")}
                    error={errors.contactNo?.message}
                    Logo={BsPerson}
                  />
                  <button
                    type="button"
                    className="btn bg-primary border-primary text-zinc-50 my-8"
                    onClick={async () => {
                      if (
                        await trigger([
                          "firstName",
                          "middleName",
                          "lastName",
                          "contactNo",
                        ])
                      ) {
                        setStep(2);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Controller
                      name="region"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Select
                          {...field}
                          value={
                            regionOptions &&
                            regionOptions.find(
                              (region) => region.value === value
                            )
                          }
                          classNames={{
                            control: ({ hasValue }) =>
                              "pl-1.5 py-2 !bg-base-300 " +
                              (hasValue && "!border-primary"),
                            placeholder: () => "!text-zinc-400 ",
                            singleValue: () => "!text-base-content",
                            input: () => "!text-base-content",
                            option: ({ isSelected, isFocused }) =>
                              isSelected || isFocused
                                ? "!bg-primary !text-zinc-100"
                                : "",
                            menu: () => "!bg-base-300",
                            dropdownIndicator: ({ hasValue }) =>
                              hasValue ? "!text-primary" : "",
                            indicatorSeparator: ({ hasValue }) =>
                              hasValue ? "!bg-primary" : "",
                          }}
                          placeholder="Region"
                          onChange={(val) => onChange(val?.value)}
                          options={regionOptions}
                          isLoading={!regionOptions}
                        />
                      )}
                    />
                    <span className="text-xs text-error pl-1">
                      {errors.region?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Controller
                      name="province"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Select
                          {...field}
                          value={
                            value
                              ? provinceOptions &&
                                provinceOptions.find(
                                  (province) => province.value === value
                                )
                              : null
                          }
                          classNames={{
                            control: ({ hasValue }) =>
                              "pl-1.5 py-2 !bg-base-300 " +
                              (hasValue && "!border-primary"),
                            placeholder: () => "!text-zinc-400 ",
                            singleValue: () => "!text-base-content",
                            input: () => "!text-base-content",
                            option: ({ isSelected, isFocused }) =>
                              isSelected || isFocused
                                ? "!bg-primary !text-zinc-100"
                                : "",
                            menu: () => "!bg-base-300",
                            dropdownIndicator: ({ hasValue }) =>
                              hasValue ? "!text-primary" : "",
                            indicatorSeparator: ({ hasValue }) =>
                              hasValue ? "!bg-primary" : "",
                          }}
                          placeholder="Province"
                          onChange={(newValue) => onChange(newValue?.value)}
                          options={provinceOptions}
                          isLoading={!provinceOptions && !!watch("region")}
                          isDisabled={!watch("region")}
                        />
                      )}
                    />
                    <span className="text-xs text-error pl-1">
                      {errors.province?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Controller
                      name="city"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Select
                          {...field}
                          value={
                            value
                              ? cityOptions &&
                                cityOptions.find((city) => city.value === value)
                              : null
                          }
                          classNames={{
                            control: ({ hasValue }) =>
                              "pl-1.5 py-2 !bg-base-300 " +
                              (hasValue && "!border-primary"),
                            placeholder: () => "!text-zinc-400 ",
                            singleValue: () => "!text-base-content",
                            input: () => "!text-base-content",
                            option: ({ isSelected, isFocused }) =>
                              isSelected || isFocused
                                ? "!bg-primary !text-zinc-100"
                                : "",
                            menu: () => "!bg-base-300",
                            dropdownIndicator: ({ hasValue }) =>
                              hasValue ? "!text-primary" : "",
                            indicatorSeparator: ({ hasValue }) =>
                              hasValue ? "!bg-primary" : "",
                          }}
                          placeholder="City"
                          onChange={(newValue) => onChange(newValue?.value)}
                          options={cityOptions}
                          isLoading={!cityOptions && !!watch("province")}
                          isDisabled={!watch("province")}
                        />
                      )}
                    />
                    <span className="text-xs text-error pl-1">
                      {errors.city?.message}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Controller
                      name="barangay"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Select
                          {...field}
                          value={
                            value
                              ? barangayOptions &&
                                barangayOptions.find(
                                  (barangay) => barangay.value === value
                                )
                              : null
                          }
                          classNames={{
                            control: ({ hasValue }) =>
                              "pl-1.5 py-2 !bg-base-300 " +
                              (hasValue && "!border-primary"),
                            placeholder: () => "!text-zinc-400 ",
                            singleValue: () => "!text-base-content",
                            input: () => "!text-base-content",
                            option: ({ isSelected, isFocused }) =>
                              isSelected || isFocused
                                ? "!bg-primary !text-zinc-100"
                                : "",
                            menu: () => "!bg-base-300",
                            dropdownIndicator: ({ hasValue }) =>
                              hasValue ? "!text-primary" : "",
                            indicatorSeparator: ({ hasValue }) =>
                              hasValue ? "!bg-primary" : "",
                          }}
                          placeholder="Barangay"
                          onChange={(newValue) => onChange(newValue?.value)}
                          options={barangayOptions}
                          isLoading={!barangayOptions && !!watch("city")}
                          isDisabled={!watch("city")}
                        />
                      )}
                    />
                    <span className="text-xs text-error pl-1">
                      {errors.barangay?.message}
                    </span>
                  </div>
                  <FormInput
                    type="text"
                    label="street"
                    placeholder="Street"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("street")}
                    error={errors.street?.message}
                    Logo={BsHouseDoor}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn bg-primary flex-1 border-primary text-zinc-50 my-8"
                      onClick={() => setStep(1)}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn bg-primary flex-1 border-primary text-zinc-50 my-8"
                      onClick={async () => {
                        if (
                          await trigger([
                            "region",
                            "province",
                            "city",
                            "barangay",
                            "street",
                          ])
                        ) {
                          setStep(3);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <FormInput
                    type="text"
                    label="email"
                    placeholder="Email"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("email")}
                    error={errors.email?.message}
                    Logo={FiAtSign}
                  />
                  <FormInput
                    type="password"
                    label="password"
                    placeholder="Password"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("password")}
                    error={errors.password?.message}
                  />
                  <FormInput
                    type="password"
                    label="confirmPassword"
                    placeholder="Confirm Password"
                    register={
                      register as UseFormRegister<
                        SignupFormValues | LoginFormValues | StaffSignupFormValues
                      >
                    }
                    value={watch("confirmPassword")}
                    error={errors.confirmPassword?.message}
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn bg-primary flex-1 border-primary text-zinc-50 mt-8 mb-4"
                      onClick={() => setStep(2)}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="btn bg-primary flex-1 border-primary text-zinc-50 mt-8 mb-4"
                    >
                      Sign up
                    </button>
                  </div>
                  <span className="text-xs text-error text-center pl-1">
                    {error &&
                      error.response.data.formErrors}
                  </span>
                </div>
              )}
            </form>
          </div>
          <footer className="text-center text-sm absolute bottom-0 p-4">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
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
