import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Select from "react-select";
import { getStaffs } from "../axios/staff";
import StaffDataRow from "../components/StaffDataRow";
import { useGetStaffs } from "../hooks/staff";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({
    queryKey: ["staff"],
    queryFn: getStaffs,
  });

const Staff = (props: Props) => {
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

  const filteredStaffs = data
    ?.sort((a, b) => {
      const roleA = a.user.role.toUpperCase();
      const roleB = b.user.role.toUpperCase();
      const nameA = a.user.name.firstName.toUpperCase();
      const nameB = b.user.name.firstName.toUpperCase();

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
      <div className="flex justify-end items-center gap-2">
        <Select
          placeholder="Role"
          options={roles}
          isClearable={true}
          classNames={{
            control: ({ hasValue }) =>
              "pl-1.5 py-1 w-44 md:w-56 !bg-base-300 " +
              (hasValue && "!border-primary"),
            placeholder: () => "!text-zinc-400 !text-sm sm:!text-base ",
            singleValue: () => "!text-base-content",
            input: () => "!text-base-content",
            option: ({ isSelected, isFocused }) =>
              isSelected || isFocused ? "!bg-primary !text-zinc-100" : "",
            menu: () => "!bg-base-300 !z-20",
            dropdownIndicator: ({ hasValue }) =>
              hasValue ? "!text-primary" : "",
            indicatorSeparator: ({ hasValue }) =>
              hasValue ? "!bg-primary" : "",
          }}
          onChange={(newValue) => setRoleFilter(newValue ? newValue.value : "")}
        />
        <input
          type="search"
          placeholder="Search..."
          className="input input-bordered w-full max-w-xs focus:outline-none"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>
      <table className="table table-fixed w-full text-sm sm:text-base">
        <thead>
          <tr>
            <th
              className="bg-primary text-white cursor-pointer"
              onClick={() =>
                setRoleSort((val) => (val === "asc" ? "desc" : "asc"))
              }
            >
              Role {roleSort}
            </th>
            <th
              className="bg-primary text-white cursor-pointer"
              onClick={() =>
                setNameSort((val) => (val === "asc" ? "desc" : "asc"))
              }
            >
              Name {nameSort}
            </th>
            <th className="bg-primary text-white cursor-pointer hidden lg:table-cell">
              Email
            </th>
            <th className="bg-primary text-white cursor-pointer hidden md:table-cell">
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
  );
};

export default Staff;
