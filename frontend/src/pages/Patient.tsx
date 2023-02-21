import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { getPatients } from "../axios/patient";
import { useGetPatients } from "../hooks/patient";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import PatientDataRow from "../components/PatientDataRow";

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
        <input
          type="search"
          placeholder="Search..."
          className="input input-bordered h-10 md:h-12 w-full max-w-[14rem] md:max-w-xs focus:outline-none"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>
      <table className="table table-fixed w-full text-sm sm:text-base">
        <thead>
          <tr>
            <th
              className="bg-primary text-white cursor-pointer"
              onClick={() =>
                setNameSort((val) => (val === "asc" ? "desc" : "asc"))
              }
            >
              <div className="flex gap-4">
                <span>Name</span>
                {nameSort === "asc" ? (
                  <FiChevronDown className="w-3.5 h-3.5" />
                ) : nameSort === "desc" ? (
                  <FiChevronUp className="w-3.5 h-3.5" />
                ) : null}
              </div>
            </th>
            <th className="bg-primary text-white cursor-pointer hidden md:table-cell">
              Address
            </th>
            <th className="bg-primary text-white cursor-pointer hidden lg:table-cell">
              Email
            </th>
            <th className="bg-primary text-white cursor-pointer">
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
