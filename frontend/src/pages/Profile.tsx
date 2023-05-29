import { useEditUser, useGetUser } from "../hooks/user";
import { z } from "zod";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FiCamera, FiEdit2, FiMapPin, FiPhone, FiX } from "react-icons/fi";
import { BsPerson, BsHouseDoor } from "react-icons/bs";
import FormInput from "../components/Form/FormInput";
import SelectDropdown from "../components/Form/SelectDropdown";
import { Navigate, useParams } from "react-router-dom";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  useGetRegionsQuery,
  useLazyGetBarangaysQuery,
  useLazyGetCitiesQuery,
  useLazyGetProvincesQuery,
} from "../redux/api/address";
import DisabledFormInput from "../components/Form/DisabledFormInput";

type EditModalProps = {
  userData: UserResponse;
  setIsEditModalVisible: Dispatch<SetStateAction<boolean>>;
};

type EditAvatarModalProps = {
  userData: UserResponse;
  setIsEditAvatarModalVisible: Dispatch<SetStateAction<boolean>>;
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
  const [isEditAvatarModalVisible, setIsEditAvatarModalVisible] =
    useState(false);
  const { userID } = useParams();
  const { data: userData, isLoading } = useGetUser(userID || "");

  if (isLoading)
    return (
      <main className="flex justify-center items-center">
        <AiOutlineLoading3Quarters className="w-16 h-16 animate-spin m-auto" />
      </main>
    );

  if (!userData) return <Navigate to="/login" />;

  return (
    <>
      <main className="flex flex-col gap-4">
        <div className="bg-base-300 w-full max-w-4xl lg:m-auto flex-1 rounded-md flex flex-col relative">
          <div className="w-full h-32 bg-primary rounded-t-md absolute"></div>
          <div
            className="absolute top-2 right-2 bg-black/25 rounded-full z-20 cursor-pointer transition hover:bg-black/40"
            onClick={() => setIsEditModalVisible(true)}
          >
            <FiEdit2 className="w-8 h-8 p-2 text-white" />
          </div>
          <div className="px-5 flex flex-col gap-2">
            <div className="px-2 pt-16 w-full z-10 flex flex-col gap-4">
              <figure
                className={`relative max-w-[8rem] max-h-[8rem] w-full h-full m-auto sm:m-0 ${
                  userData.role !== "Patient" && "cursor-pointer"
                } group`}
                onClick={() =>
                  userData.role !== "Patient" &&
                  setIsEditAvatarModalVisible(true)
                }
              >
                {userData.role !== "Patient" && (
                  <div className="absolute bottom-2 right-0 bg-black/75 rounded-full transition group-hover:bg-black/90">
                    <FiCamera className="w-8 h-8 p-2 text-white" />
                  </div>
                )}
                <img
                  src={userData.avatar}
                  className="w-[8rem] h-[8rem] bg-base-300 rounded-full object-cover"
                ></img>
              </figure>
              <div className="flex flex-col items-center sm:items-start">
                <span className="font-semibold">
                  {userData.name.firstName} {userData.name.middleName}{" "}
                  {userData.name.lastName}
                </span>
                <span className="text-zinc-400 text-sm">{userData.email}</span>
                <span className="my-2 font-semibold text-primary text-sm">
                  {userData.role}
                </span>
              </div>
            </div>
            <div className="px-2 py-4 border-t flex justify-between">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-primary" />
                    <span className="font-semibold text-primary">Address</span>
                  </div>
                  {userData.address ? (
                    <div className="flex gap-6 text-sm">
                      <div className="flex flex-col gap-1 font-semibold">
                        <p>Region:</p>
                        <p>Province:</p>
                        <p>City:</p>
                        <p>Barangay:</p>
                        <p>Street:</p>
                      </div>
                      <div className="flex flex-col gap-1 text-zinc-400">
                        <p>{userData.address.region || "-"}</p>
                        <p>{userData.address.province || "-"}</p>
                        <p>{userData.address.city || "-"}</p>
                        <p>{userData.address.barangay || "-"}</p>
                        <p>{userData.address.street || "-"}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-400">No address</span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-primary" />
                    <span className="font-semibold text-primary">
                      Contact Number
                    </span>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {userData.contactNo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isEditModalVisible && (
        <EditProfileModal
          userData={userData}
          setIsEditModalVisible={setIsEditModalVisible}
        />
      )}

      {isEditAvatarModalVisible && (
        <EditAvatarModal
          userData={userData}
          setIsEditAvatarModalVisible={setIsEditAvatarModalVisible}
        />
      )}
    </>
  );
};

const EditProfileModal = ({
  userData,
  setIsEditModalVisible,
}: EditModalProps) => {
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>();
  const [selectedRegion, setSelectedRegion] = useState<Region>();
  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>();
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [cityOptions, setCityOptions] = useState<SelectOption[]>();
  const [selectedCity, setSelectedCity] = useState<City>();
  const [barangayOptions, setBarangayOptions] = useState<SelectOption[]>();

  const { mutate: editUser, error: editUserError } = useEditUser();

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
  } = useForm<EditFormValues>({
    defaultValues: {
      firstName: userData.name.firstName,
      middleName: userData.name.middleName || "",
      lastName: userData.name.lastName,
      contactNo: userData.contactNo ? userData.contactNo.slice(3) : "",
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

  const onSubmit: SubmitHandler<EditFormValues> = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach((entry) => {
      const [key, value] = entry;

      if (value) {
        if (key === "contactNo") {
          formData.append(key, "+63" + value);
          return;
        }

        formData.append(key, value);
      }
    });

    editUser(
      {
        data: formData,
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
    <div
      className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsEditModalVisible(false);
      }}
    >
      <section className="bg-base-300 max-w-4xl rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mx-2 py-3">Edit Profile</h1>
          <FiX
            className="cursor-pointer w-10 h-5"
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
              type="text"
              label="contactNo"
              placeholder="Contact Number"
              register={register}
              value={watch("contactNo")}
              error={errors.contactNo?.message}
              Logo={FiPhone}
            />
          </div>
          {isEditAddressOpen ? (
            <div className="flex flex-col gap-1">
              <div
                className="ml-auto cursor-pointer"
                onClick={() => setIsEditAddressOpen(false)}
              >
                <FiX className="w-8 h-8 p-2" />
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
                        isLoading={isRegionsLoading}
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
                        isLoading={isProvincesLoading}
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
                        isLoading={isCitiesLoading}
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
                        isLoading={isBarangaysLoading}
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
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div
                className="ml-auto cursor-pointer"
                onClick={() => setIsEditAddressOpen(true)}
              >
                <FiEdit2 className="w-8 h-8 p-2" />
              </div>
              <div className="flex gap-1">
                <DisabledFormInput
                  type="text"
                  label="region"
                  placeholder="Region"
                  value={userData.address?.region || ""}
                  Logo={BsHouseDoor}
                />
                <DisabledFormInput
                  type="text"
                  label="province"
                  placeholder="Province"
                  value={userData.address?.province || ""}
                  Logo={BsHouseDoor}
                />
              </div>
              <div className="flex gap-1">
                <DisabledFormInput
                  type="text"
                  label="city"
                  placeholder="City"
                  value={userData.address?.city || ""}
                  Logo={BsHouseDoor}
                />
                <DisabledFormInput
                  type="text"
                  label="barangay"
                  placeholder="Barangay"
                  value={userData.address?.barangay || ""}
                  Logo={BsHouseDoor}
                />
              </div>
              <DisabledFormInput
                type="text"
                label="street"
                placeholder="Street"
                value={userData.address?.street || ""}
                Logo={BsHouseDoor}
              />
            </div>
          )}

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

const EditAvatarModal = ({
  userData,
  setIsEditAvatarModalVisible,
}: EditAvatarModalProps) => {
  const [avatar, setAvatar] = useState<File | string | undefined>(
    userData.avatar
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const imageLoadingRef = useRef<HTMLDivElement>(null);

  const { mutate: editUser, isLoading: isEditUserLoading } = useEditUser();

  const handleAvatar = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>
  ) => {
    const file =
      "dataTransfer" in e
        ? e.dataTransfer?.files[0]
        : e.target.files
        ? e.target.files[0]
        : undefined;

    const fileExtension = file && file.type.split("/").pop();

    if (fileExtension && !["jpg", "jpeg", "png"].includes(fileExtension)) {
      toast.error("Invalid file type");
      return;
    }

    setAvatar(file);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    handleAvatar(e);
  };

  const handleDragOver: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
  };

  const handleDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    handleAvatar(e);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (avatar instanceof Blob) formData.append("avatar", avatar);

    editUser(
      { data: formData, id: userData._id },
      {
        onSuccess: () => {
          setIsEditAvatarModalVisible(false);
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useLayoutEffect(() => {
    if (imageRef.current && imageLoadingRef.current) {
      imageLoadingRef.current.style.display = "block";

      imageRef.current.onload = () => {
        if (imageLoadingRef.current) {
          imageLoadingRef.current.style.display = "none";
        }
      };
    }
  }, [imageRef.current, imageLoadingRef.current]);

  return (
    <div
      className="fixed flex items-center justify-center inset-0 bg-black z-30 bg-opacity-25"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsEditAvatarModalVisible(false);
      }}
    >
      <section className="flex flex-col gap-4 bg-base-300 max-w-lg w-full rounded-2xl shadow-md px-8 py-10">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mx-2 py-3">Edit Avatar</h1>
          <FiX
            className="cursor-pointer w-6 h-6"
            onClick={() => setIsEditAvatarModalVisible(false)}
          />
        </header>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {avatar ? (
            <figure
              className="relative bg-base-100 w-full rounded-lg overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div
                className="absolute top-2 right-2 bg-black/25 rounded-full cursor-pointer transition hover:bg-black/40"
                onClick={(e) => {
                  e.stopPropagation;
                  setAvatar(undefined);
                }}
              >
                <FiX className="w-6 h-6  p-1 text-white" />
              </div>
              <img
                ref={imageRef}
                className="w-full rounded-lg z-10"
                src={
                  typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                }
                width={800}
                height={800}
              />
              <div
                ref={imageLoadingRef}
                className="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
              </div>
            </figure>
          ) : (
            <label
              htmlFor="avatar"
              className={`flex flex-col justify-center items-center gap-2 bg-base-100 min-h-[24rem] border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition hover:bg-opacity-50`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="bg-base-300 rounded-full" draggable>
                <MdOutlineAddAPhoto className="w-16 h-16 p-4" />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-semibold">Add Photo</p>
                <p className="text-sm font-light">or drag and drop</p>
              </div>
            </label>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="btn btn-primary text-white"
            disabled={
              !avatar || typeof avatar === "string" || isEditUserLoading
            }
          >
            {!isEditUserLoading ? (
              "Save"
            ) : (
              <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
