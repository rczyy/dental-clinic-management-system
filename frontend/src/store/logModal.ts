import { create } from "zustand";

interface LogState {
  logData: LogResponse;
  logModal: boolean;
  showLogModal: (logData: LogResponse) => void;
  closeLogModal: () => void;
}

export const useLogStore = create<LogState>()((set) => ({
  logModal: false,
  logData: {
    action: "",
    date: "",
    module: "",
    type: "",
    user: {
      email: "",
      name: {
        firstName: "",
        middleName: "",
        lastName: ""
      },
      role: ""
    },
    _id: ""
  },
  showLogModal: (logData) => set(() => ({ logModal: true, logData })),
  closeLogModal: () =>
    set(() => ({
      logModal: false,
      logData: {
        action: "",
        date: "",
        module: "",
        type: "",
        user: {
          email: "",
          name: {
            firstName: "",
            middleName: "",
            lastName: ""
          },
          role: ""
        },
        _id: ""
      }
    }))
}));
