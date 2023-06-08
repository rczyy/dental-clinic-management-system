import { useState } from "react";
import { useGetDeletedPatients, useGetPatients } from "../hooks/patient";
import { FiPlus, FiSearch } from "react-icons/fi";
import PatientDataRow from "../components/Table/PatientDataRow";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { Link, Navigate } from "react-router-dom";
import { useGetMe } from "../hooks/user";
import { useAdminStore } from "../store/admin";

type Props = {};

const PatientList = (props: Props) => {
  const sidebar = useAdminStore((state) => state.sidebar);

  const { data: me } = useGetMe();
  const { data: patients, isLoading: patientsLoading } = useGetPatients();
  const { data: deletedPatients, isLoading: deletedPatientsLoading } =
    useGetDeletedPatients();

  const [seeDeletedPatients, setSeeDeletedPatients] = useState<boolean>(false);
  const [searchDeletedFilter, setSearchDeletedFilter] = useState<string>("");
  const [nameDeletedSort, setNameDeletedSort] = useState<"asc" | "desc">();

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
      .filter(
        (patient) =>
          `${patient.user.name.firstName} ${patient.user.name.lastName}`
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) && patient.user.verified
      );

  const filteredDeletedPatients =
    deletedPatients &&
    deletedPatients
      .sort((a, b) => {
        const nameA = a.user.name.firstName.toUpperCase();
        const nameB = b.user.name.firstName.toUpperCase();

        return nameDeletedSort === "asc"
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
        (patient) =>
          `${patient.user.name.firstName} ${patient.user.name.lastName}`
            .toLowerCase()
            .includes(searchDeletedFilter.toLowerCase()) &&
          patient.user.verified
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
          <h1 className="font-bold text-2xl md:text-3xl">Patients</h1>

          {(me.role === "Admin" || me.role === "Manager") && (
            <div className="form-control">
              <label className="label gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={() => setSeeDeletedPatients(!seeDeletedPatients)}
                  checked={seeDeletedPatients}
                />
                <span className="label-text">See deleted patients</span>
              </label>
            </div>
          )}
        </div>
        <Link
          to="/patient/register"
          role="button"
          className="btn btn-primary w-full max-w-[10rem] min-h-[2.5rem] h-10 px-2 text-white normal-case gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add a Patient
        </Link>
      </header>

      {seeDeletedPatients && (
        <>
          <div className="flex justify-end items-center">
            <div className="flex flex-1 items-center bg-base-300 border rounded-md">
              <FiSearch className="w-10 h-10 px-2.5" />
              <input
                type="text"
                placeholder="Search deleted patient..."
                className="input bg-base-300 w-full h-10 pl-0 pr-2 md:pr-4 focus:outline-none placeholder:text-sm"
                onChange={(e) => setSearchDeletedFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-base-300 py-4 pr-4 rounded-box overflow-x-auto">
            <table className="table [&>*]:bg-base-300 w-full text-sm sm:text-base">
              <thead>
                <tr className="[&>*]:bg-base-300 border-b border-base-200">
                  {filteredDeletedPatients &&
                    filteredDeletedPatients.length > 0 && (
                      <th className="min-w-[2.5rem] w-10"></th>
                    )}

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
                {filteredDeletedPatients &&
                  (filteredDeletedPatients.length > 0 ? (
                    filteredDeletedPatients.map((patient) => (
                      <PatientDataRow key={patient._id} patient={patient} />
                    ))
                  ) : (
                    <tr className="[&>*]:bg-transparent">
                      <td
                        colSpan={4}
                        className="py-8 text-2xl text-center font-bold"
                      >
                        No deleted patients found
                      </td>
                    </tr>
                  ))}

                {deletedPatientsLoading && (
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
              {filteredPatients && filteredPatients.length > 0 && (
                <th className="min-w-[2.5rem] w-10"></th>
              )}

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
            {filteredPatients &&
              (filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <PatientDataRow key={patient._id} patient={patient} />
                ))
              ) : (
                <tr className="[&>*]:bg-transparent">
                  <td
                    colSpan={4}
                    className="py-8 text-2xl text-center font-bold"
                  >
                    No patients registered
                  </td>
                </tr>
              ))}

            {patientsLoading && (
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
export default PatientList;
