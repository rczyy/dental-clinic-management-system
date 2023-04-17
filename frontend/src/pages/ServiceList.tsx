import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useGetServices } from "../hooks/service";
import SelectDropdown from "../components/Form/SelectDropdown";
import ServiceDataRow from "../components/Table/ServiceDataRow";

type Props = {};

const ServiceList = (props: Props) => {
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

  const { data } = useGetServices();
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

  return (
    <div className="flex flex-col gap-4">
      <header className="flex justify-between items-end mb-4 gap-8">
        <h1 className="font-bold text-2xl md:text-3xl">Service List</h1>
        <Link
          to="/dashboard/services/add"
          role="button"
          className="btn btn-primary w-full max-w-[10rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add a Service
        </Link>
      </header>
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
              <th></th>
              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setNameSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center gap-1">
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
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  {categorySort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : categorySort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>

              <th className="text-primary normal-case">Estimated Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices &&
              filteredServices.map((service) => (
                <ServiceDataRow key={service._id} service={service} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceList;
