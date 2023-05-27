import { useState } from "react";
import { useGetPatients } from "../hooks/patient";
import { FiPlus, FiSearch } from "react-icons/fi";
import PatientDataRow from "../components/Table/PatientDataRow";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { Link, Navigate } from "react-router-dom";
import { useGetMe } from "../hooks/user";

type Props = {};

const PatientList = (props: Props) => {
  const { data: me } = useGetMe();
  const { data: patients } = useGetPatients();
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [nameSort, setNameSort] = useState<"asc" | "desc">();

  const filteredPatients =
    patients &&
    patients
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
      .filter((patient) =>
        (patient.user.name.firstName + patient.user.name.lastName)
          .toLowerCase()
          .includes(searchFilter.toLowerCase())
      );

  if (!me || me.role === "Patient") return <Navigate to="/" />;

  return (
    <main className={`flex flex-col gap-4 max-w-screen-2xl m-auto`}>
      <header className="flex justify-between items-end mb-4 gap-8">
        <h1 className="font-bold text-2xl md:text-3xl">Patient List</h1>
        <Link
          to="/patient/register"
          role="button"
          className="btn btn-primary w-full max-w-[10rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add a Patient
        </Link>
      </header>
      <div className="flex justify-end items-center">
        <div className="flex flex-1 items-center bg-base-300 border rounded-md">
          <FiSearch className="w-10 h-10 px-2.5" />
          <input
            type="text"
            placeholder="Search..."
            className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-base-300 py-4 pr-4 rounded-box overflow-x-auto">
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
                  <span>Name</span>
                  {nameSort === "asc" ? (
                    <AiFillCaretDown className="w-2.5 h-2.5" />
                  ) : nameSort === "desc" ? (
                    <AiFillCaretUp className="w-2.5 h-2.5" />
                  ) : null}
                </div>
              </th>
              <th className="text-primary normal-case">Address</th>
              <th className="text-primary normal-case">Contact No.</th>
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
    </main>
  );
};
export default PatientList;
