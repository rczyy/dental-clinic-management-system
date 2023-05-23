import { MdOutlineModeEditOutline } from "react-icons/md";
import { useEditUser, useGetMe } from "../hooks/user";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FiPhone } from "react-icons/fi";
import { BsPerson, BsHouseDoor } from "react-icons/bs";
import {
  getCities,
  getProvinces,
  getRegions,
  getBarangays,
} from "../api/philippineAddress";
import { GrFormClose } from "react-icons/gr";
import FormInput from "../components/Form/FormInput";
import SelectDropdown from "../components/Form/SelectDropdown";
import { Navigate } from "react-router-dom";

type Props = {
  setIsEditModalVisible: Dispatch<SetStateAction<boolean>>;
};
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
  contactNo: z
    .string({ required_error: "Contact number is required" })
    .min(1, "Contact number cannot be empty")
    .regex(/(^9)\d{9}$/, "Invalid contact number"),
});

const Profile = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { data: userData } = useGetMe();
  return (
    <>
      <main className="flex flex-col gap-4">
        <div className="bg-base-300 w-full max-w-4xl lg:m-auto flex-1 rounded-md flex flex-col relative">
          <div className="w-full h-32 bg-primary rounded-t-md absolute"></div>
          <div
            className="w-10 h-10 flex justify-center items-center absolute z-20 self-end hover:cursor-pointer hover:text-base-300"
            onClick={() => setIsEditModalVisible(true)}
          >
            <MdOutlineModeEditOutline/>
          </div>
          {userData && (
            <div className="px-5 flex flex-col gap-2">
              <div className="pt-16 pl-2 pr-5 w-full z-10 flex flex-col  gap-5">
                <img className="m-auto rounded-full bg-emerald-500 w-32 h-32 md:m-0"></img>
                <div className="flex flex-1 justify-between px-3">
                  <div className="flex flex-col">
                    <span>
                      {userData.name.firstName} {userData.name.middleName}{" "}
                      {userData.name.lastName}
                    </span>
                    <span>{userData.email}</span>
                  </div>
                </div>
              </div>
              <div className="py-3 px-5 border-t flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col justify-between">
                    <span className="font-semibold text-primary">Address</span>
                    {userData.address ? (
                      <div>
                        <span>
                          {userData.address.street &&
                            `${userData.address.street},`}{" "}
                        </span>
                        <span>
                          {userData.address.barangay &&
                            `${userData.address.barangay},`}{" "}
                        </span>
                        <span>
                          {userData.address.city && `${userData.address.city},`}{" "}
                        </span>
                        <span>
                          {userData.address.province &&
                            `${userData.address.province},`}{" "}
                        </span>
                        <span>{userData.address.region}</span>
                      </div>
                    ) : (
                      <span>No address</span>
                    )}
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className="font-semibold text-primary">
                      Contact Number
                    </span>
                    <span>{userData.contactNo}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {isEditModalVisible && (
        <EditProfileModal setIsEditModalVisible={setIsEditModalVisible} />
      )}
    </>
  );
};

const EditProfileModal = ({ setIsEditModalVisible }: Props) => {
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

  const { data: userData } = useGetMe();
  const { mutate: editUser, error: editUserError } = useEditUser();

  if (!userData) return <Navigate to="/dashboard" />;
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    defaultValues: {
      firstName: userData.name.firstName,
      middleName: userData.name.middleName || "",
      lastName: userData.name.lastName,
      contactNo: userData.contactNo.slice(3),
      region: userData.address?.region || "",
      province: userData.address?.province || "",
      city: userData.address?.city || "",
      barangay: userData.address?.barangay || "",
      street: userData.address?.street || "",
      role: userData.role,
    },
    resolver: zodResolver(schema),
  });

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

  const onSubmit: SubmitHandler<EditFormValues> = (data) => {
    console.log(data.region);
    editUser(
      {
        data: { ...data, contactNo: "+63" + watch("contactNo") },
        id: userData._id,
      },
      {
        onSuccess: () => {
          setIsEditModalVisible(false);
          reset();
        },
      }
    );
  };
  return (
    <div className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25">
      <section className="bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mx-2 py-3">Edit Profile</h1>
          <GrFormClose
            className="hover: cursor-pointer w-10 h-5"
            onClick={() => setIsEditModalVisible(false)}
          />
        </header>
        <form
          className="flex flex-col px-2 py-4 md:py-8 gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col md:flex-row gap-1">
            <FormInput
              type="text"
              label="firstName"
              placeholder="First Name"
              register={register}
              value={watch("firstName")}
              error={errors.firstName?.message}
              Logo={BsPerson}
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
            />
            <FormInput
              type="number"
              label="contactNo"
              placeholder="Contact Number"
              register={register}
              value={watch("contactNo")}
              error={errors.contactNo?.message}
              Logo={FiPhone}
            />
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col flex-1 gap-1">
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
            <div className="flex flex-col flex-1 gap-1">
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
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col flex-1 gap-1">
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
            <div className="flex flex-col flex-1 gap-1">
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
          <div className="flex flex-col items-start gap-2 px-2">
            <button
              type="submit"
              className="btn btn-primary min-h-[2.5rem] h-10 border-primary text-zinc-50 w-full sm:w-48 px-8 mt-8"
            >
              Edit Profile
            </button>
            <p className="px-2 text-xs text-error text-center">
              {editUserError && editUserError.response.data.message}
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};
export default Profile;
