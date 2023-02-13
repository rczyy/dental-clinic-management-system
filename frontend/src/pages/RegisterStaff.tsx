import { useState, useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiAtSign } from "react-icons/fi";
import { BsPerson, BsHouseDoor } from "react-icons/bs";
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
import { useRegisterStaff } from "../hooks/staff";

type Props = {};

const schema = yup
  .object({
    firstName: yup.string().required("First Name is required"),
    middleName: yup.string().required("Middle Name is required"),
    lastName: yup.string().required("Last Name is required"),
    role: yup.string().required("Role is required"),
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

const RegisterStaff = (props: Props) => {
  const roles = [
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Dentist", label: "Dentist" },
    { value: "Assistant", label: "Assistant Dentist" },
    { value: "Front Desk", label: "Front Desk Staff" },
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

  const signupMutation = useRegisterStaff();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
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
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    signupMutation.mutate(data, {
      onSuccess: () =>
        reset({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          contactNo: "",
          role: "",
          region: "",
          province: "",
          city: "",
          barangay: "",
          street: "",
        }),
    });
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

  return (
    <div className="adminMain font-work w-full flex flex-col items-center">
      <section className="bg-base-300 px-2 rounded-2xl max-w-4xl w-full shadow-md sm:px-10 pt-4">
        <header className="flex justify-start">
          <h1 className="py-3 text-xl font-semibold mx-2">Add a new staff</h1>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex flex-col gap-1">
            <div className="p-2 rounded flex-1">
              <h2 className="font-semibold mx-1 ">Personal Details</h2>
              <div>
                <FormInput
                  type="text"
                  label="firstName"
                  placeholder="First name"
                  register={register}
                  value={watch("firstName")}
                  error={errors.firstName?.message}
                  Logo={FiAtSign}
                />
              </div>
              <div className="flex flex-col sm:flex-row w-full justify-evenly sm:gap-1">
                <FormInput
                  type="text"
                  label="middleName"
                  placeholder="Middle name"
                  register={register}
                  value={watch("middleName")}
                  error={errors.middleName?.message}
                  Logo={FiAtSign}
                />
                <FormInput
                  type="text"
                  label="lastName"
                  placeholder="Last name"
                  register={register}
                  value={watch("lastName")}
                  error={errors.lastName?.message}
                  Logo={FiAtSign}
                />
              </div>
              <div>
                <FormInput
                  type="text"
                  label="email"
                  placeholder="Email"
                  register={register}
                  value={watch("email")}
                  error={errors.email?.message}
                  Logo={FiAtSign}
                />
              </div>
              <div>
                <FormInput
                  type="number"
                  inputMode="numeric"
                  label="contactNo"
                  placeholder="Contact Number"
                  register={register}
                  value={watch("contactNo")}
                  error={errors.contactNo?.message}
                  Logo={BsPerson}
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
                        roles && roles.find((role) => role.value === value)
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
            <div className="p-2 rounded flex-1">
              <h2 className="font-semibold mx-1">Address</h2>
              <div className="flex flex-col gap-1">
                <Controller
                  name="region"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Select
                      {...field}
                      value={
                        regionOptions &&
                        regionOptions.find((region) => region.value === value)
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
                register={register}
                value={watch("street")}
                error={errors.street?.message}
                Logo={BsHouseDoor}
              />
            </div>
          </section>
          <div className="flex gap-2 sm:justify-start px-2">
            <button
              type="submit"
              className="btn bg-primary border-primary text-zinc-50 mt-4 w-full sm:w-fit"
            >
              Register staff
            </button>
          </div>
          <span className="text-xs text-error text-center pl-1">
            {signupMutation.error &&
              (signupMutation.error as any).response.data.formErrors}
          </span>
        </form>
      </section>
    </div>
  );
};

export default RegisterStaff;
