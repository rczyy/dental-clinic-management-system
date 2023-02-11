import { useState, useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiAtSign } from "react-icons/fi";
import { Link } from "react-router-dom";
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
      .min(11, "Invalid phone number")
      .max(11, "Invalid phone number"),
  })
  .required();

const Signup = (props: Props) => {
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

  const signupMutation = useRegisterPatient();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
        setValue("contactNo", "+63" + watch("contactNo"))
        console.log(data);
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
        reset((formValues) => ({
          ...formValues,
          province: "",
          city: "",
          barangay: "",
        }));

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
        reset((formValues) => ({
          ...formValues,
          city: "",
          barangay: "",
        }));

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
        reset((formValues) => ({
          ...formValues,
          barangay: "",
        }));

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
              <Controller
                name="region"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Select
                    {...field}
                    value={
                      regionOptions &&
                      regionOptions.find((c) => c.value === value)
                    }
                    classNames={{
                      control: ({ hasValue }) =>
                        "pl-1.5 py-2 " + (hasValue && "!border-primary"),
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
                        "pl-1.5 py-2 " + (hasValue && "!border-primary"),
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
                        "pl-1.5 py-2 " + (hasValue && "!border-primary"),
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
                        "pl-1.5 py-2 " + (hasValue && "!border-primary"),
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
                type="password"
                label="confirmPassword"
                placeholder="Confirm Password"
                register={register}
                value={watch("confirmPassword")}
                error={errors.confirmPassword?.message}
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
                Sign up
              </button>
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
