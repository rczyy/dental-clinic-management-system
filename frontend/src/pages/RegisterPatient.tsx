import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiAtSign, FiPhone } from "react-icons/fi";
import { BsPerson, BsHouseDoor } from "react-icons/bs";
import { useRegisterPatient } from "../hooks/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInput from "../components/Form/FormInput";
import SelectDropdown from "../components/Form/SelectDropdown";
import { toast } from "react-toastify";
import {
  useGetRegionsQuery,
  useLazyGetBarangaysQuery,
  useLazyGetCitiesQuery,
  useLazyGetProvincesQuery,
} from "../redux/api/address";

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
    .regex(/(^9)\d{9}$/, "Invalid contact number"),
});

const RegisterPatient = (_: Props) => {
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>();
  const [selectedRegion, setSelectedRegion] = useState<Region>();
  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>();
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [cityOptions, setCityOptions] = useState<SelectOption[]>();
  const [selectedCity, setSelectedCity] = useState<City>();
  const [barangayOptions, setBarangayOptions] = useState<SelectOption[]>();

  const { mutate, isLoading, error } = useRegisterPatient();

  const { data: regions, isFetching: isRegionsLoading } = useGetRegionsQuery();
  const [getProvinces, { data: provinces, isFetching: isProvincesLoading }] =
    useLazyGetProvincesQuery();
  const [getCities, { data: cities, isFetching: isCitiesLoading }] =
    useLazyGetCitiesQuery();
  const [getBarangays, { data: barangays, isFetching: isBarangaysLoading }] =
    useLazyGetBarangaysQuery();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
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
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    mutate(
      { ...data, contactNo: "+63" + watch("contactNo") },
      {
        onSuccess: (data) => {
          reset({
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
    if (regions)
      setRegionOptions(
        regions.map((region) => ({
          value: region.name,
          label: region.name,
        }))
      );
  }, [regions]);

  useEffect(() => {
    if (regions && watch("region")) {
      setProvinceOptions([]);

      setSelectedRegion(
        regions.find((region) => region.name === watch("region"))
      );

      reset(
        (formValues) => ({
          ...formValues,
          province: "",
          city: "",
          barangay: "",
        }),
        { keepErrors: true }
      );
    }
  }, [watch("region")]);

  useEffect(() => {
    if (selectedRegion) getProvinces(selectedRegion.code || "");
  }, [selectedRegion]);

  useEffect(() => {
    if (provinces)
      setProvinceOptions(
        provinces.map((province) => ({
          value: province.name,
          label: province.name,
        }))
      );
  }, [provinces]);

  useEffect(() => {
    if (provinces && watch("province")) {
      setCityOptions([]);

      setSelectedProvince(
        provinces.find((province) => province.name === watch("province"))
      );

      reset(
        (formValues) => ({
          ...formValues,
          city: "",
          barangay: "",
        }),
        { keepErrors: true }
      );
    }
  }, [watch("province")]);

  useEffect(() => {
    if (selectedProvince) getCities(selectedProvince.code || "");
  }, [selectedProvince]);

  useEffect(() => {
    if (cities)
      setCityOptions(
        cities.map((city) => ({
          value: city.name,
          label: city.name,
        }))
      );
  }, [cities]);

  useEffect(() => {
    if (cities && watch("city")) {
      setBarangayOptions([]);

      setSelectedCity(cities.find((city) => city.name === watch("city")));

      reset(
        (formValues) => ({
          ...formValues,
          barangay: "",
        }),
        { keepErrors: true }
      );
    }
  }, [watch("city")]);

  useEffect(() => {
    if (selectedCity) getBarangays(selectedCity.code || "");
  }, [selectedCity]);

  useEffect(() => {
    if (barangays)
      setBarangayOptions(
        barangays.map((barangay) => ({
          value: barangay.name,
          label: barangay.name,
        }))
      );
  }, [barangays]);

  return (
    <div className="w-full h-full flex">
      <section className="bg-base-300 max-w-4xl w-full m-auto rounded-2xl shadow-md px-8 py-10 md:px-10 lg:px-16">
        <header className="flex justify-start">
          <h1 className="text-2xl font-bold mx-2 py-3">Add a new patient</h1>
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
                  type="text"
                  label="contactNo"
                  placeholder="Contact Number"
                  register={register}
                  value={watch("contactNo")}
                  error={errors.contactNo?.message}
                  Logo={FiPhone}
                  required
                />
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
                      isLoading={isRegionsLoading}
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
                      isLoading={isProvincesLoading}
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
                      isLoading={isCitiesLoading}
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
                      isLoading={isBarangaysLoading}
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
          <div className="flex flex-col items-start gap-2 px-2">
            <button
              type="submit"
              className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 w-full sm:w-48 px-8 mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
              ) : (
                "Add Patient"
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
export default RegisterPatient;
