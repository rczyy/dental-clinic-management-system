import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useGetDeletedServices, useGetServices } from "../hooks/service";
import SelectDropdown from "../components/Form/SelectDropdown";
import ServiceDataRow from "../components/Table/ServiceDataRow";
import { useGetMe } from "../hooks/user";
import { useAdminStore } from "../store/admin";

type Props = {};

const ServiceList = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);
  const categories = [
    { value: "", label: "All" },
    { value: "First Appointment", label: "First Appointment" },
    { value: "Restoration", label: "Restoration" },
    { value: "Cosmetic", label: "Cosmetic" },
    { value: "Root Canal Treatment", label: "Root Canal Treatment" },
    { value: "Crowns and Bridges", label: "Crowns and Bridges" },
    {
      value: "Oral Surgery or Extractions",
      label: "Oral Surgery or Extractions",
    },
    { value: "Dentures", label: "Dentures" },
    { value: "Orthodontics (Braces)", label: "Orthodontics (Braces)" },
  ];

  const { data: me } = useGetMe();
  const { data } = useGetServices();
  const { data: deletedServices } = useGetDeletedServices();

  const [seeDeletedService, setSeeDeletedService] = useState<boolean>(false);

  const [searchDeletedFilter, setSearchDeletedFilter] = useState<string>("");
  const [categoryDeletedFilter, setCategoryDeletedFilter] =
    useState<string>("");
  const [categoryDeletedSort, setCategoryDeletedSort] = useState<
    "asc" | "desc"
  >();
  const [nameDeletedSort, setNameDeletedSort] = useState<"asc" | "desc">();

  const [searchFilter, setSearchFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [categorySort, setCategorySort] = useState<"asc" | "desc">();
  const [nameSort, setNameSort] = useState<"asc" | "desc">();

  const filteredServices =
    data &&
    data
      .sort((a, b) => {
        const categoryA: string = a.category.toUpperCase();
        const categoryB: string = b.category.toUpperCase();
        const nameA: string = a.name.toUpperCase();
        const nameB: string = b.name.toUpperCase();

        if (categorySort && nameSort) {
          if (categoryA === categoryB) {
            return nameSort === "asc"
              ? nameA < nameB
                ? -1
                : 1
              : nameA < nameB
              ? 1
              : -1;
          } else {
            return categorySort === "asc"
              ? categoryA < categoryB
                ? -1
                : 1
              : categoryA < categoryB
              ? 1
              : -1;
          }
        }

        return categorySort === "asc"
          ? categoryA < categoryB
            ? -1
            : 1
          : categorySort === "desc"
          ? categoryA < categoryB
            ? 1
            : -1
          : nameSort === "asc"
          ? nameA < nameB
            ? -1
            : 1
          : nameSort === "desc"
          ? nameA < nameB
            ? 1
            : -1
          : 0;
      })
      .filter(
        (service) =>
          service.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
          service.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );

  const filteredDeletedServices =
    deletedServices &&
    deletedServices
      .sort((a, b) => {
        const categoryA: string = a.category.toUpperCase();
        const categoryB: string = b.category.toUpperCase();
        const nameA: string = a.name.toUpperCase();
        const nameB: string = b.name.toUpperCase();

        if (categoryDeletedSort && nameDeletedSort) {
          if (categoryA === categoryB) {
            return nameDeletedSort === "asc"
              ? nameA < nameB
                ? -1
                : 1
              : nameA < nameB
              ? 1
              : -1;
          } else {
            return categoryDeletedSort === "asc"
              ? categoryA < categoryB
                ? -1
                : 1
              : categoryA < categoryB
              ? 1
              : -1;
          }
        }

        return categoryDeletedSort === "asc"
          ? categoryA < categoryB
            ? -1
            : 1
          : categoryDeletedSort === "desc"
          ? categoryA < categoryB
            ? 1
            : -1
          : nameDeletedSort === "asc"
          ? nameA < nameB
            ? -1
            : 1
          : nameDeletedSort === "desc"
          ? nameA < nameB
            ? 1
            : -1
          : 0;
      })
      .filter(
        (service) =>
          service.name
            .toLowerCase()
            .includes(searchDeletedFilter.toLowerCase()) &&
          service.category
            .toLowerCase()
            .includes(categoryDeletedFilter.toLowerCase())
      );

  if (!me || me.role === "Patient") return <Navigate to="/" />;

  return (
    <main
      className={`flex flex-col gap-4 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } m-auto transition-[max-width]`}
    >
      <header className="flex justify-between items-end mb-4 gap-8">
        <div className="flex gap-8">
          <h1 className="font-bold text-2xl md:text-3xl">Services</h1>

          {(me.role === "Admin" || me.role === "Manager") && (
            <div className="form-control">
              <label className="label gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={() => setSeeDeletedService(!seeDeletedService)}
                  checked={seeDeletedService}
                />
                <span className="label-text">See deleted service</span>
              </label>
            </div>
          )}
        </div>
        <Link
          to="/services/add"
          role="button"
          className="btn btn-primary w-full max-w-[10rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add a Service
        </Link>
      </header>

      {seeDeletedService && (
        <>
          <div className="flex justify-end items-center gap-2">
            <div className="flex flex-1 items-center bg-base-300 border rounded-md">
              <FiSearch className="w-10 h-10 px-2.5" />
              <input
                type="text"
                placeholder="Search..."
                className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
                onChange={(e) => setSearchDeletedFilter(e.target.value)}
              />
            </div>
            <div className="w-40">
              <SelectDropdown
                placeholder={
                  categoryDeletedFilter != "" ? categoryDeletedFilter : "All"
                }
                options={categories}
                isClearable={true}
                onChange={(newValue) =>
                  setCategoryDeletedFilter(newValue ? newValue.value : "")
                }
              />
            </div>
          </div>
          <div className="bg-base-300 py-4 pr-4 rounded-box overflow-x-auto">
            <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
              <thead>
                <tr className="[&>*]:bg-base-300 border-b border-base-200">
                  {filteredDeletedServices &&
                    filteredDeletedServices.length > 0 && (
                      <th className="min-w-[2.5rem] w-10"></th>
                    )}

                  <th
                    className="text-primary normal-case cursor-pointer"
                    onClick={() =>
                      setNameDeletedSort((val) =>
                        val === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    <div className="flex justify-center items-center gap-1">
                      <span>Service Name</span>
                      {nameDeletedSort === "asc" ? (
                        <AiFillCaretDown className="w-2.5 h-2.5" />
                      ) : nameDeletedSort === "desc" ? (
                        <AiFillCaretUp className="w-2.5 h-2.5" />
                      ) : null}
                    </div>
                  </th>

                  <th
                    className="text-primary normal-case cursor-pointer"
                    onClick={() =>
                      setCategoryDeletedSort((val) =>
                        val === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    <div className="flex justify-center items-center gap-1">
                      <span>Category</span>
                      {categoryDeletedSort === "asc" ? (
                        <AiFillCaretDown className="w-2.5 h-2.5" />
                      ) : categoryDeletedSort === "desc" ? (
                        <AiFillCaretUp className="w-2.5 h-2.5" />
                      ) : null}
                    </div>
                  </th>

                  <th className="text-primary text-center normal-case">
                    Estimated Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeletedServices &&
                  (filteredDeletedServices.length > 0 ? (
                    filteredDeletedServices.map((service) => (
                      <ServiceDataRow key={service._id} service={service} />
                    ))
                  ) : (
                    <tr className="[&>*]:bg-transparent">
                      <td
                        colSpan={5}
                        className="py-8 text-2xl text-center font-bold"
                      >
                        No deleted service found
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex justify-end items-center gap-2">
        <div className="flex flex-1 items-center bg-base-300 border rounded-md">
          <FiSearch className="w-10 h-10 px-2.5" />
          <input
            type="text"
            placeholder="Search..."
            className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        <div className="w-40">
          <SelectDropdown
            placeholder={categoryFilter != "" ? categoryFilter : "All"}
            options={categories}
            isClearable={true}
            onChange={(newValue) =>
              setCategoryFilter(newValue ? newValue.value : "")
            }
          />
        </div>
      </div>
      <div className="bg-base-300 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              {filteredServices && filteredServices.length > 0 && (
                <th className="min-w-[2.5rem] w-10"></th>
              )}

              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setNameSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex justify-center items-center gap-1">
                  <span>Service Name</span>
                  {nameSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : nameSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>

              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setCategorySort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex justify-center items-center gap-1">
                  <span>Category</span>
                  {categorySort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : categorySort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>

              <th className="text-primary text-center normal-case">
                Estimated Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredServices &&
              (filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <ServiceDataRow key={service._id} service={service} />
                ))
              ) : (
                <tr className="[&>*]:bg-transparent">
                  <td
                    colSpan={3}
                    className="py-8 text-2xl text-center font-bold"
                  >
                    No services to show
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default ServiceList;
