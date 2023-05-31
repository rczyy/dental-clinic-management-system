import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useGetStaffs } from "../hooks/staff";
import StaffDataRow from "../components/Table/StaffDataRow";
import SelectDropdown from "../components/Form/SelectDropdown";
import { useGetMe } from "../hooks/user";
import { useAdminStore } from "../store/admin";

type Props = {};

const StaffList = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);

  const roles = [
    { value: "", label: "All" },
    { value: "Manager", label: "Manager" },
    { value: "Dentist", label: "Dentist" },
    { value: "Assistant", label: "Assistant Dentist" },
    { value: "Front Desk", label: "Front Desk" },
  ];
  const { data: me } = useGetMe();
  const { data: staffs } = useGetStaffs();
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [roleSort, setRoleSort] = useState<"asc" | "desc">();
  const [nameSort, setNameSort] = useState<"asc" | "desc">();

  const filteredStaffs =
    staffs &&
    staffs
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
          `${staff.user.name.firstName} ${staff.user.name.lastName}`
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) &&
          staff.user.role.includes(roleFilter)
      );

  if (!me || me.role === "Patient") return <Navigate to="/" />;

  return (
    <main
      className={`flex flex-col gap-4 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } m-auto transition-[max-width]`}
    >
      <header className="flex justify-between items-end mb-4 gap-8">
        <h1 className="font-bold text-2xl md:text-3xl">Staff</h1>
        <Link
          to="/staff/register"
          role="button"
          className="btn btn-primary w-full max-w-[10rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add a Staff
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
            placeholder={roleFilter != "" ? roleFilter : "All"}
            options={roles}
            isClearable={true}
            onChange={(newValue) =>
              setRoleFilter(newValue ? newValue.value : "")
            }
          />
        </div>
      </div>
      <div className="bg-base-300 py-4 pr-4 rounded-box overflow-x-auto">
        <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
          <thead>
            <tr className="[&>*]:bg-base-300 border-b border-base-200">
              {filteredStaffs && filteredStaffs.length > 0 && (
                <th className="min-w-[2.5rem] w-10"></th>
              )}

              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setRoleSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex justify-center items-center gap-1">
                  <span>Role</span>
                  {roleSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : roleSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>

              <th></th>

              <th
                className="text-primary normal-case cursor-pointer"
                onClick={() =>
                  setNameSort((val) => (val === "asc" ? "desc" : "asc"))
                }
              >
                <div className="flex justify-center items-center gap-1">
                  <span>Name</span>
                  {nameSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : nameSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>

              <th className="text-primary text-center normal-case">Email</th>

              <th className="text-primary text-center normal-case">
                Contact No.
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs &&
              (filteredStaffs.length > 0 ? (
                filteredStaffs.map((staff) => (
                  <StaffDataRow key={staff._id} staff={staff} />
                ))
              ) : (
                <tr className="[&>*]:bg-transparent">
                  <td
                    colSpan={5}
                    className="py-8 text-2xl text-center font-bold"
                  >
                    No staffs registered
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default StaffList;
