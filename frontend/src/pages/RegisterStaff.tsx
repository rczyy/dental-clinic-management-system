import { useState, useEffect, useRef } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  UseFormRegister,
} from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiAtSign, FiPhone } from "react-icons/fi";
import { BsPerson, BsHouseDoor } from "react-icons/bs";
import {
  getCities,
  getProvinces,
  getRegions,
  getBarangays,
} from "../api/philippineAddress";
import { useRegisterStaff } from "../hooks/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import FormInput from "../components/FormInput";

type Props = {};

const schema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required"),
  middleName: z
    .string({ required_error: "Middle name is required" })
    .min(1, "Middle name is required"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required"),
  region: z
    .string({ required_error: "Region is required" })
    .min(1, "Region is required"),
  province: z
    .string({ required_error: "Province is required" })
    .min(1, "Province is required"),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City is required"),
  barangay: z
    .string({ required_error: "Barangay is required" })
    .min(1, "Barangay is required"),
  street: z
    .string({ required_error: "Street is required" })
    .min(1, "Street is required"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  contactNo: z
    .string({ required_error: "Invalid contact number" })
    .length(10, "Invalid contact number"),
  role: z
    .string({ required_error: "Role is required" })
    .min(1, "Role is required"),
});

const RegisterStaff = (props: Props) => {
  const roles = [
    { value: "Manager", label: "Manager" },
    { value: "Dentist", label: "Dentist" },
    { value: "Assistant", label: "Assistant Dentist" },
    { value: "Front Desk", label: "Front Desk" },
  ];
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

  const { mutate, isLoading, error } = useRegisterStaff();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<StaffSignupFormValues>({
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
      role: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<StaffSignupFormValues> = (data) => {
    mutate(
      { ...data, contactNo: "+63" + watch("contactNo") },
      {
        onSuccess: () =>
          reset({
            firstName: "",
            middleName: "",
            lastName: "",
            contactNo: "",
            role: "",
            region: "",
            province: "",
            city: "",
            barangay: "",
            street: "",
            email: "",
          }),
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
        setProvinceOptions(undefined);
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
        setCityOptions(undefined);
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
        setBarangayOptions(undefined);
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

  return (
    <div className="w-full h-full flex transition-all">
      <section className="bg-base-300 max-w-4xl w-full m-auto rounded-2xl shadow-md px-8 py-10 md:px-10 lg:px-16">
        <header className="flex justify-start">
          <h1 className="text-2xl font-bold mx-2 py-3">Add a new staff</h1>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex flex-col gap-1">
            <div className="flex flex-col p-2 rounded flex-1 gap-2">
              <h2 className="font-semibold m-1 ">Personal Details</h2>
              <div>
                <FormInput
                  type="text"
                  label="firstName"
                  placeholder="First name"
                  register={
                    register as UseFormRegister<
                      SignupFormValues | LoginFormValues | StaffSignupFormValues
                    >
                  }
                  value={watch("firstName")}
                  error={errors.firstName?.message}
                  Logo={BsPerson}
                />
              </div>
              <div className="flex flex-col sm:flex-row w-full justify-evenly gap-1">
                <FormInput
                  type="text"
                  label="middleName"
                  placeholder="Middle name"
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
                  placeholder="Last name"
                  register={
                    register as UseFormRegister<
                      SignupFormValues | LoginFormValues | StaffSignupFormValues
                    >
                  }
                  value={watch("lastName")}
                  error={errors.lastName?.message}
                  Logo={BsPerson}
                />
              </div>
              <div>
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
              </div>
              <div>
                <FormInput
                  type="number"
                  label="contactNo"
                  placeholder="Contact Number"
                  register={
                    register as UseFormRegister<
                      SignupFormValues | LoginFormValues | StaffSignupFormValues
                    >
                  }
                  value={watch("contactNo")}
                  error={errors.contactNo?.message}
                  Logo={FiPhone}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Controller
                  name="role"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Select
                      {...field}
                      value={
                        value
                          ? roles && roles.find((role) => role.value === value)
                          : null
                      }
                      classNames={{
                        control: ({ hasValue }) =>
                          "pl-1.5 py-2 !bg-base-300 " +
                          (hasValue && "!border-primary"),
                        placeholder: () =>
                          "!text-zinc-400 !text-sm sm:!text-base ",
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
                      placeholder="Role"
                      onChange={(val) => onChange(val?.value)}
                      options={roles}
                      isLoading={!roles}
                    />
                  )}
                />
                <span className="text-xs text-error pl-1">
                  {errors.role?.message}
                </span>
              </div>
            </div>
            <div className="flex flex-col p-2 rounded flex-1 gap-2">
              <h2 className="font-semibold m-1">Address</h2>
              <div className="flex flex-col gap-1">
                <Controller
                  name="region"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Select
                      {...field}
                      value={
                        value
                          ? regionOptions &&
                            regionOptions.find(
                              (region) => region.value === value
                            )
                          : null
                      }
                      classNames={{
                        control: ({ hasValue }) =>
                          "pl-1.5 py-2 !bg-base-300 " +
                          (hasValue && "!border-primary"),
                        placeholder: () =>
                          "!text-zinc-400 !text-sm sm:!text-base ",
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
                        placeholder: () =>
                          "!text-zinc-400 !text-sm sm:!text-base ",
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
                        placeholder: () =>
                          "!text-zinc-400 !text-sm sm:!text-base ",
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
                        placeholder: () =>
                          "!text-zinc-400 !text-sm sm:!text-base ",
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
            </div>
          </section>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-start px-2">
            <button
              type="submit"
              className="btn bg-primary border-primary text-zinc-50 w-full sm:w-48 px-8 mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
              ) : (
                "Register Staff"
              )}
            </button>
            <span className="text-xs text-error text-center">
              {error && (error as any).response.data.formErrors}
            </span>
          </div>
        </form>
      </section>
    </div>
  );
};

export default RegisterStaff;
