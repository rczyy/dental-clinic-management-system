import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PatientFileDataRow } from "./PatientFileDataRow";
import { useGetMe } from "../../hooks/user";

interface Props {
  files: PatientFileResponse[] | undefined;
  filesLoading: boolean;
  hideService?: boolean;
}

export const PatientFileTable = ({ files, filesLoading, hideService }: Props): JSX.Element => {
  const { data: me } = useGetMe();

  return (
    <div className="border border-neutral rounded-md overflow-auto">
      <table className="table [&_td]:bg-base-300 w-full">
        <thead className="[&_td]:border-b [&_td]:border-neutral [&_td]:text-zinc-400 [&_td]:text-sm [&_td]:font-medium [&_td]:normal-case">
          <tr>
            <td>Name</td>
            <td>Size</td>
            {!hideService && <td>Bill Service</td>}
            <td>Uploaded On</td>
            {files && files.length > 0 && me?.role !== "Assistant" && me?.role !== "Patient" && (
              <td className="p-0"></td>
            )}
          </tr>
        </thead>

        <tbody className="[&_td]:border-neutral [&_td]:text-xs [&_td:first-child]:font-bold [&_td]:font-medium">
          {files ? (
            files.length > 0 ? (
              files.map((file) => (
                <PatientFileDataRow key={file._id} file={file} hideService={!!hideService} />
              ))
            ) : (
              <tr>
                <td className="text-zinc-400 text-center !font-medium" colSpan={5}>
                  No patient files
                </td>
              </tr>
            )
          ) : (
            filesLoading && (
              <tr>
                <td className="p-2" colSpan={5}>
                  <AiOutlineLoading3Quarters className="w-6 h-6 mx-auto text-primary animate-spin" />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
