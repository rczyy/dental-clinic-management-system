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
import FormInput from "../components/Form/FormInput";
import SelectDropdown from "../components/Form/SelectDropdown";
import { toast } from "react-toastify";

type Props = {};

const schema = z.object({
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
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  contactNo: z
    .string({ required_error: "Contact number is required" })
    .min(1, "Contact number cannot be empty")
    .regex(/(^9)\d{9}$/, "Invalid contact number"),
  role: z
    .string({ required_error: "Role is required" })
    .min(1, "Role is required"),
});

const RegisterStaff = (props: Props) => {
  const roles: SelectOption[] = [
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
  const [_, setBarangays] = useState<Barangay[]>();
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
        onSuccess: (data) => {
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
          });
          toast.success(
            `Successfully registered ${data.name.firstName} ${data.name.lastName}`,
            {
              theme:
                localStorage.getItem("theme") === "darkTheme"
                  ? "dark"
                  : "light",
            }
          );
        },
        onError(error) {
          toast.error(
            "message" in error.response.data
              ? error.response.data.message
              : error.response.data.formErrors,
            {
              theme:
                localStorage.getItem("theme") === "darkTheme"
                  ? "dark"
                  : "light",
            }
          );
        },
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
                  register={register}
                  value={watch("firstName")}
                  error={errors.firstName?.message}
                  Logo={BsPerson}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row w-full justify-evenly gap-1">
                <FormInput
                  type="text"
                  label="middleName"
                  placeholder="Middle name"
                  register={register}
                  value={watch("middleName")}
                  error={errors.middleName?.message}
                  Logo={BsPerson}
                />
                <FormInput
                  type="text"
                  label="lastName"
                  placeholder="Last name"
                  register={register}
                  value={watch("lastName")}
                  error={errors.lastName?.message}
                  Logo={BsPerson}
                  required
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
                  required
                />
              </div>
              <div>
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
              </div>
              <div className="flex flex-col gap-1">
                <Controller
                  name="role"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <SelectDropdown
                      {...field}
                      value={value}
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
              <h2 className="font-semibold m-1">Address (optional)</h2>
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
          <div className="flex flex-col items-start gap-2 px-2">
            <button
              type="submit"
              className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 w-full sm:w-48 px-8 mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
              ) : (
                "Add Staff"
              )}
            </button>
            <span className="px-2 text-xs text-error text-center">
              {error && (error as any).response.data.formErrors}
            </span>
          </div>
        </form>
      </section>
    </div>
  );
};

export default RegisterStaff;
