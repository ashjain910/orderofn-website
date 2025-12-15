import type { ToastPosition } from "react-toastify";

export const toastOptions: {
    position: ToastPosition;
    autoClose: number;
    hideProgressBar: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
    draggable: boolean;
    progress: undefined;
} = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};
