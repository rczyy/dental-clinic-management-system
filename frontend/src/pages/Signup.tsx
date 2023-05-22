import { useState, useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiAtSign, FiPhone } from "react-icons/fi";
import { BsPerson, BsHouseDoor } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRegisterPatient } from "../hooks/patient";
import { useGetUser } from "../hooks/user";
import {
  getCities,
  getProvinces,
  getRegions,
  getBarangays,
} from "../api/philippineAddress";
import * as z from "zod";
import FormInput from "../components/Form/FormInput";
import SelectDropdown from "../components/Form/SelectDropdown";
import { IoMailOpenOutline } from "react-icons/io5";

type Props = {};

const schema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(1, "First name cannot be empty")
      .regex(/^[A-Za-zÑñ. ]+$/, "Invalid first name"),
    middleName: z.preprocess(
      (data) => {
        if (!data || typeof data !== "string") return undefined;
        return data === "" ? undefined : data;
      },
      z
        .string()
        .min(1, "Middle name cannot be empty")
        .regex(/^[A-Za-zÑñ ]+$/, "Invalid middle name")
        .optional()
    ),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(1, "Last name cannot be empty")
      .regex(/^[A-Za-zÑñ ]+$/, "Invalid last name"),
    region: z.preprocess(
      (data) => {
        if (!data || typeof data !== "string") return undefined;
        return data === "" ? undefined : data;
      },
      z
        .string()
        .min(1, "Region cannot be empty")
        .regex(/^[A-Za-z. -]+$/, "Invalid region")
        .optional()
    ),
    province: z.preprocess(
      (data) => {
        if (!data || typeof data !== "string") return undefined;
        return data === "" ? undefined : data;
      },
      z
        .string()
        .min(1, "Province cannot be empty")
        .regex(/^[A-Za-zÑñ.() -]+$/, "Invalid province")
        .optional()
    ),
    city: z.preprocess(
      (data) => {
        if (!data || typeof data !== "string") return undefined;
        return data === "" ? undefined : data;
      },
      z
        .string()
        .min(1, "City cannot be empty")
        .regex(/^[\dA-Za-zÑñ.() -]+$/, "Invalid city")
        .optional()
    ),
    barangay: z.preprocess(
      (data) => {
        if (!data || typeof data !== "string") return undefined;
        return data === "" ? undefined : data;
      },
      z
        .string()
        .min(1, "Barangay cannot be empty")
        .regex(/^[\dA-Za-zÑñ.() -]+$/, "Invalid barangay")
        .optional()
    ),
    street: z.preprocess(
      (data) => {
        if (!data || typeof data !== "string") return undefined;
        return data === "" ? undefined : data;
      },
      z
        .string()
        .min(1, "Street cannot be empty")
        .regex(/^[\dA-Za-zÑñ.() -]+$/, "Invalid street")
        .optional()
    ),
    email: z.string({ required_error: "Email is required" }).email(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be atleast 6 characters"),
    confirmPassword: z
      .string({ required_error: "Confirm your password" })
      .min(1, "Confirm your password"),
    contactNo: z
      .string({ required_error: "Contact number is required" })
      .min(1, "Contact number cannot be empty")
      .regex(/(^9)\d{9}$/, "Invalid contact number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
  });

const Signup = (_: Props) => {
  const [step, setStep] = useState<number>(1);
  const [regions, setRegions] = useState<Region[]>();
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>();
  const [provinces, setProvinces] = useState<Province[]>();
  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>();
  const [cities, setCities] = useState<City[]>();
  const [cityOptions, setCityOptions] = useState<SelectOption[]>();
  const [__, setBarangays] = useState<Barangay[]>();
  const [barangayOptions, setBarangayOptions] = useState<SelectOption[]>();
  const oldRegionValue = useRef<string>();
  const oldProvinceValue = useRef<string>();
  const oldCityValue = useRef<string>();

  const { data } = useGetUser();
  const { mutate, isSuccess, isLoading, error } = useRegisterPatient();

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
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    mutate({ ...data, contactNo: "+63" + watch("contactNo") });
  };

  if (data) return <Navigate to="/" />;

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
        setProvinceOptions(undefined);
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
        setCityOptions(undefined);
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
        setBarangayOptions(undefined);
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

  return (
    <main className="flex items-center justify-center">
      {isSuccess ? (
        <div className="flex flex-col items-center bg-base-300 max-w-lg p-12 mx-auto my-4 gap-4 rounded-lg text-center">
          <IoMailOpenOutline className="w-20 h-20 text-primary" />
          <h2 className="text-2xl md:text-3xl font-semibold">
            Verify your email
          </h2>
          <p className="text-sm text-zinc-400">
            We've sent a verification email to {watch("email")}. You need to
            verify your email address to start booking to AT Dental Home.
          </p>
          <Link to={"/login"}>
            <button className="btn btn-primary min-h-[2.5rem] h-10 px-16 mt-8 text-white capitalize">
              Done
            </button>
          </Link>
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
            <div className="flex flex-col gap-8 flex-1">
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
                <h1 className="text-3xl font-bold">
                  {step === 1
                    ? "Personal details"
                    : step === 2
                    ? "Address details (optional)"
                    : "Account details"}
                </h1>
              </header>
              <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                  <div className="flex flex-col gap-4">
                    <FormInput
                      type="text"
                      label="firstName"
                      placeholder="First Name"
                      register={register}
                      value={watch("firstName")}
                      error={errors.firstName?.message}
                      Logo={BsPerson}
                      required
                    />
                    <FormInput
                      type="text"
                      label="middleName"
                      placeholder="Middle Name"
                      register={register}
                      value={watch("middleName")}
                      error={errors.middleName?.message}
                      Logo={BsPerson}
                    />
                    <FormInput
                      type="text"
                      label="lastName"
                      placeholder="Last Name"
                      register={register}
                      value={watch("lastName")}
                      error={errors.lastName?.message}
                      Logo={BsPerson}
                      required
                    />
                    <FormInput
                      type="number"
                      label="contactNo"
                      placeholder="Contact Number"
                      register={register}
                      value={watch("contactNo")}
                      error={errors.contactNo?.message}
                      Logo={FiPhone}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 my-8"
                      onClick={async () => {
                        if (
                          await trigger(
                            [
                              "firstName",
                              "middleName",
                              "lastName",
                              "contactNo",
                            ],
                            { shouldFocus: true }
                          )
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
                          <SelectDropdown
                            {...field}
                            value={value}
                            placeholder="Region"
                            onChange={(val) => onChange(val?.value)}
                            options={regionOptions || []}
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
                          <SelectDropdown
                            {...field}
                            value={value}
                            placeholder="Province"
                            onChange={(newValue) => onChange(newValue?.value)}
                            options={provinceOptions || []}
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
                          <SelectDropdown
                            {...field}
                            value={value}
                            placeholder="City"
                            onChange={(newValue) => onChange(newValue?.value)}
                            options={cityOptions || []}
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
                          <SelectDropdown
                            {...field}
                            value={value}
                            placeholder="Barangay"
                            onChange={(newValue) => onChange(newValue?.value)}
                            options={barangayOptions || []}
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
                      register={register}
                      value={watch("street")}
                      error={errors.street?.message}
                      Logo={BsHouseDoor}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 my-8"
                        onClick={() => setStep(1)}
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 my-8"
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
                      register={register}
                      value={watch("email")}
                      error={errors.email?.message}
                      Logo={FiAtSign}
                      required
                    />
                    <FormInput
                      type="password"
                      label="password"
                      placeholder="Password"
                      register={register}
                      value={watch("password")}
                      error={errors.password?.message}
                      required
                    />
                    <FormInput
                      type="password"
                      label="confirmPassword"
                      placeholder="Confirm Password"
                      register={register}
                      value={watch("confirmPassword")}
                      error={errors.confirmPassword?.message}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 mt-8 mb-4"
                        onClick={() => setStep(2)}
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary min-h-[2.5rem] h-10 flex-1 border-primary text-zinc-50 mt-8 mb-4"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                        ) : (
                          "Sign Up"
                        )}
                      </button>
                    </div>
                    <span className="text-xs text-error text-center pl-1">
                      {error &&
                        "formErrors" in error.response.data &&
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
      )}
    </main>
  );
};

export default Signup;
