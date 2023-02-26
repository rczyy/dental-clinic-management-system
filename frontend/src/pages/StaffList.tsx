import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import Select from "react-select";
import { getStaffs } from "../axios/staff";
import StaffDataRow from "../components/Table/StaffDataRow";
import { useGetStaffs } from "../hooks/staff";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({
    queryKey: ["staffs"],
    queryFn: getStaffs,
  });

const StaffList = (props: Props) => {
  const roles = [
    { value: "Manager", label: "Manager" },
    { value: "Dentist", label: "Dentist" },
    { value: "Assistant", label: "Assistant Dentist" },
    { value: "Front Desk", label: "Front Desk" },
  ];
  const { data } = useGetStaffs();
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [roleSort, setRoleSort] = useState<"asc" | "desc">();
  const [nameSort, setNameSort] = useState<"asc" | "desc">();

  const filteredStaffs =
    data &&
    data
      .sort((a, b) => {
        const roleA: string = a.user.role.toUpperCase();
        const roleB: string = b.user.role.toUpperCase();
        const nameA: string = a.user.name.firstName.toUpperCase();
        const nameB: string = b.user.name.firstName.toUpperCase();

        if (roleSort && nameSort) {
          if (roleA === roleB) {
            return nameSort === "asc"
              ? nameA < nameB
                ? -1
                : 1
              : nameA < nameB
              ? 1
              : -1;
          } else {
            return roleSort === "asc"
              ? roleA < roleB
                ? -1
                : 1
              : roleA < roleB
              ? 1
              : -1;
          }
        }

        return roleSort === "asc"
          ? roleA < roleB
            ? -1
            : 1
          : roleSort === "desc"
          ? roleA < roleB
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
        (staff) =>
          (staff.user.name.firstName + staff.user.name.lastName)
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) &&
          staff.user.role.includes(roleFilter)
      );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex justify-between items-end mb-4 gap-8">
        <h1 className="font-bold text-2xl md:text-3xl">Staff List</h1>
        <Link
          to="/admin/register-staff"
          role="button"
          className="btn btn-primary w-full max-w-[10rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add a Staff
        </Link>
      </header>
      <div className="flex justify-end items-center gap-2">
        <div className="flex flex-1 items-center bg-base-300 border rounded-md">
          <FiSearch className="w-9 h-9 px-2.5" />
          <input
            type="text"
            placeholder="Search..."
            className="input bg-base-300 w-full h-8 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        <Select
          placeholder="Role"
          options={roles}
          isClearable={true}
          classNames={{
            container: () => "flex-1 max-w-[12rem]",
            control: ({ hasValue }) =>
              "pl-1.5 py-[1px] w-full !bg-base-300 " +
              (hasValue && "!border-primary"),
            placeholder: () => "!text-zinc-400 !text-sm",
            singleValue: () => "!text-base-content !text-sm",
            input: () => "!text-base-content",
            option: ({ isSelected, isFocused }) =>
              "!text-sm " +
              (isSelected ? "!bg-primary !text-zinc-100 " : "") +
              (isFocused && !isSelected ? "!bg-neutral" : ""),
            menu: () => "!bg-base-300 !z-20",
            dropdownIndicator: ({ hasValue }) =>
              hasValue ? "!text-primary" : "",
            indicatorSeparator: ({ hasValue }) =>
              hasValue ? "!bg-primary" : "",
          }}
          onChange={(newValue) => setRoleFilter(newValue ? newValue.value : "")}
        />
      </div>
      <div className="bg-base-300 p-4 rounded-box">
        <table className="table table-fixed [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setRoleSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center gap-1">
                  <span>Role</span>
                  {roleSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : roleSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>
              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setNameSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex items-center gap-1">
                  <span>Name</span>
                  {nameSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : nameSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>
              <th className="text-primary normal-case hidden lg:table-cell">
                Email
              </th>
              <th className="text-primary normal-case hidden md:table-cell">
                Contact No.
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs &&
              filteredStaffs.map((staff) => (
                <StaffDataRow key={staff._id} staff={staff} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
