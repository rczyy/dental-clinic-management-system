import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { getPatients } from "../axios/patient";
import { useGetPatients } from "../hooks/patient";
import { FiSearch } from "react-icons/fi";
import PatientDataRow from "../components/PatientDataRow";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

type Props = {};

export const loader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

const Patient = (props: Props) => {
  const { data } = useGetPatients();
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [nameSort, setNameSort] = useState<"asc" | "desc">();

  const filteredPatients =
    data &&
    data
      .sort((a, b) => {
        const nameA = a.user.name.firstName.toUpperCase();
        const nameB = b.user.name.firstName.toUpperCase();

        return nameSort === "asc"
          ? nameA < nameB
            ? -1
            : 1
          : nameSort === "desc"
          ? nameA < nameB
            ? 1
            : -1
          : 0;
      })
      .filter((staff) =>
        (staff.user.name.firstName + staff.user.name.lastName)
          .toLowerCase()
          .includes(searchFilter.toLowerCase())
      );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end items-center">
        <div className="flex flex-1 items-center bg-base-300 border rounded-md">
          <FiSearch className="w-9 h-9 md:w-10 md:h-10 px-2.5" />
          <input
            type="text"
            placeholder="Search..."
            className="input bg-base-300 w-full h-9 md:h-11 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm md:placeholder:text-base"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>
      <table className="table table-fixed w-full text-sm sm:text-base">
        <thead>
          <tr className="border-b border-base-200">
            <th
              className="bg-base-100 text-primary normal-case cursor-pointer"
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
            <th className="bg-base-100 text-primary normal-case hidden md:table-cell">
              Address
            </th>
            <th className="bg-base-100 text-primary normal-case hidden lg:table-cell">
              Email
            </th>
            <th className="bg-base-100 text-primary normal-case">
              Contact No.
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients &&
            filteredPatients.map((patient) => (
              <PatientDataRow key={patient._id} patient={patient} />
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default Patient;
