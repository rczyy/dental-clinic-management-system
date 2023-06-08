import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useGetDeletedStaffs, useGetStaffs } from "../hooks/staff";
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
  const { data: staffs, isLoading: staffsLoading } = useGetStaffs();
  const { data: deletedStaffs, isLoading: deletedStaffsLoading } =
    useGetDeletedStaffs();

  const [seeDeletedStaff, setSeeDeletedStaff] = useState<boolean>(false);

  const [searchDeletedFilter, setSearchDeletedFilter] = useState<string>("");
  const [roleDeletedFilter, setRoleDeletedFilter] = useState<string>("");
  const [roleDeletedSort, setRoleDeletedSort] = useState<"asc" | "desc">();
  const [nameDeletedSort, setNameDeletedSort] = useState<"asc" | "desc">();

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

  const filteredDeletedStaffs =
    deletedStaffs &&
    deletedStaffs
      .sort((a, b) => {
        const roleA: string = a.user.role.toUpperCase();
        const roleB: string = b.user.role.toUpperCase();
        const nameA: string = a.user.name.firstName.toUpperCase();
        const nameB: string = b.user.name.firstName.toUpperCase();

        if (roleDeletedSort && nameDeletedSort) {
          if (roleA === roleB) {
            return nameDeletedSort === "asc"
              ? nameA < nameB
                ? -1
                : 1
              : nameA < nameB
              ? 1
              : -1;
          } else {
            return roleDeletedSort === "asc"
              ? roleA < roleB
                ? -1
                : 1
              : roleA < roleB
              ? 1
              : -1;
          }
        }

        return roleDeletedSort === "asc"
          ? roleA < roleB
            ? -1
            : 1
          : roleDeletedSort === "desc"
          ? roleA < roleB
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
        (staff) =>
          `${staff.user.name.firstName} ${staff.user.name.lastName}`
            .toLowerCase()
            .includes(searchDeletedFilter.toLowerCase()) &&
          staff.user.role.includes(roleDeletedFilter)
      );

  if (!me || me.role === "Patient") return <Navigate to="/" />;

  return (
    <main
      className={`flex flex-col gap-4 ${
        sidebar ? "max-w-screen-2xl" : "max-w-screen-xl"
      } m-auto transition-[max-width]`}
    >
      <header className="flex flex-wrap justify-between items-end mb-4 gap-4">
        <div className="flex gap-8">
          <h1 className="font-bold text-2xl md:text-3xl">Staff</h1>

          {(me.role === "Admin" || me.role === "Manager") && (
            <div className="form-control">
              <label className="label gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={() => setSeeDeletedStaff(!seeDeletedStaff)}
                  checked={seeDeletedStaff}
                />
                <span className="label-text">See deleted staff</span>
              </label>
            </div>
          )}
        </div>
        <Link
          to="/staff/register"
          role="button"
          className="btn btn-primary w-full max-w-[10rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add a Staff
        </Link>
      </header>

      {seeDeletedStaff && (
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
                  roleDeletedFilter != "" ? roleDeletedFilter : "All"
                }
                options={roles}
                isClearable={true}
                onChange={(newValue) =>
                  setRoleDeletedFilter(newValue ? newValue.value : "")
                }
              />
            </div>
          </div>
          <div className="bg-base-300 py-4 pr-4 rounded-box overflow-x-auto">
            <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
              <thead>
                <tr className="[&>*]:bg-base-300 border-b border-base-200">
                  {filteredDeletedStaffs &&
                    filteredDeletedStaffs.length > 0 && (
                      <th className="min-w-[2.5rem] w-10"></th>
                    )}

                  <th
                    className="text-primary normal-case cursor-pointer"
                    onClick={() =>
                      setRoleDeletedSort((val) =>
                        val === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    <div className="flex justify-center items-center gap-1">
                      <span>Role</span>
                      {roleDeletedSort === "asc" ? (
                        <AiFillCaretDown className="w-2.5 h-2.5" />
                      ) : roleDeletedSort === "desc" ? (
                        <AiFillCaretUp className="w-2.5 h-2.5" />
                      ) : null}
                    </div>
                  </th>

                  <th></th>

                  <th
                    className="text-primary normal-case cursor-pointer"
                    onClick={() =>
                      setNameDeletedSort((val) =>
                        val === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    <div className="flex justify-center items-center gap-1">
                      <span>Name</span>
                      {nameDeletedSort === "asc" ? (
                        <AiFillCaretDown className="w-2.5 h-2.5" />
                      ) : nameDeletedSort === "desc" ? (
                        <AiFillCaretUp className="w-2.5 h-2.5" />
                      ) : null}
                    </div>
                  </th>

                  <th className="text-primary text-center normal-case">
                    Address
                  </th>

                  <th className="text-primary text-center normal-case">
                    Contact No.
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeletedStaffs &&
                  (filteredDeletedStaffs.length > 0 ? (
                    filteredDeletedStaffs.map((staff) => (
                      <StaffDataRow key={staff._id} staff={staff} />
                    ))
                  ) : (
                    <tr className="[&>*]:bg-transparent">
                      <td
                        colSpan={5}
                        className="py-8 text-2xl text-center font-bold"
                      >
                        No deleted staff found
                      </td>
                    </tr>
                  ))}

                {deletedStaffsLoading && (
                  <tr className="[&>*]:bg-transparent">
                    <td colSpan={8}>
                      <AiOutlineLoading3Quarters className="w-16 h-16 mx-auto py-4 text-primary animate-spin" />
                    </td>
                  </tr>
                )}
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

              <th className="text-primary text-center normal-case">Address</th>

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
                    No staff registered
                  </td>
                </tr>
              ))}

            {staffsLoading && (
              <tr className="[&>*]:bg-transparent">
                <td colSpan={8}>
                  <AiOutlineLoading3Quarters className="w-16 h-16 mx-auto py-4 text-primary animate-spin" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default StaffList;
