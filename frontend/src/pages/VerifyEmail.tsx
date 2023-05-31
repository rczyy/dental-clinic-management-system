import { Link, useSearchParams } from "react-router-dom";
import { MdCheckCircle, MdError } from "react-icons/md";
import { useVerifyUser } from "../hooks/user";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect } from "react";
import { useRequestEmailVerification } from "../hooks/email";
import { toast } from "react-toastify";

interface Props {}

export const VerifyEmail = (_: Props): JSX.Element => {
  const [searchParams] = useSearchParams();

  const {
    mutate: verifyUser,
    data: verifyUserData,
    error: verifyUserError,
    isLoading: verifyUserLoading,
  } = useVerifyUser();

  const {
    mutate: requestEmailVerification,
    isLoading: requestEmailVerificationLoading,
  } = useRequestEmailVerification();

  useEffect(() => {
    if (!verifyUserData) verifyUser(searchParams.get("token") || "");
  }, [verifyUserData]);

  return (
    <main className="flex flex-col justify-center flex-1 px-4 pt-16">
      <div className="flex flex-col items-center bg-base-300 max-w-lg p-12 mx-auto my-4 gap-4 rounded-lg text-center">
        {verifyUserLoading ? (
          <AiOutlineLoading3Quarters className="w-16 h-16 text-primary animate-spin" />
        ) : verifyUserError ? (
          <>
            <MdError className="w-16 h-16 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold">
              Invalid email verification link
            </h2>
            <p className="text-sm text-zinc-400">
              Sorry, but this email verification link is invalid. You can
              request another email verification link by clicking the button
              below.
            </p>
            <button
              className="btn btn-primary min-h-[2.5rem] h-10 px- mt-8 text-white normal-case"
              onClick={() =>
                requestEmailVerification(searchParams.get("token") || "", {
                  onSuccess(data) {
                    toast.success(data.message, {
                      theme:
                        localStorage.getItem("theme") === "darkTheme"
                          ? "dark"
                          : "light",
                    });
                  },
                  onError(error) {
                    toast.error(error.response.data.message, {
                      theme:
                        localStorage.getItem("theme") === "darkTheme"
                          ? "dark"
                          : "light",
                    });
                  },
                })
              }
            >
              Request another link{" "}
              {requestEmailVerificationLoading && (
                <AiOutlineLoading3Quarters className="ml-4 text-white animate-spin" />
              )}
            </button>
          </>
        ) : verifyUserData &&
          verifyUserData.message.includes("has been already verified") ? (
          <>
            <MdCheckCircle className="w-16 h-16 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold">
              Email already verified
            </h2>
            <p className="text-sm text-zinc-400">
              Your email has already been verified.
            </p>
            <Link to={"/"}>
              <button className="btn btn-primary min-h-[2.5rem] h-10 px- mt-8 text-white normal-case">
                Go to Home Page
              </button>
            </Link>
          </>
        ) : (
          <>
            <MdCheckCircle className="w-16 h-16 text-primary" />
            <h2 className="text-2xl md:text-3xl font-semibold">Verified!</h2>
            <p className="text-sm text-zinc-400">
              Account has been successfully verified.
            </p>
            <Link to={"/"}>
              <button className="btn btn-primary min-h-[2.5rem] h-10 px- mt-8 text-white capitalize">
                Go to Home Page
              </button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
};
