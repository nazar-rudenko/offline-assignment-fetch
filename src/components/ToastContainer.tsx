import ErrorToast from "./ErrorToast.tsx";
import { useUiStore } from "../stores/ui";

const ToastContainer = () => {
  const errors = useUiStore((state) => state.errors);
  const hideErrorMessage = useUiStore((state) => state.hideErrorMessage);

  const handleClose = (id: number) => () => hideErrorMessage(id);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md flex flex-col space-y-2 z-50">
      {errors.map((error) => (
        <ErrorToast
          key={error.id}
          message={error.message}
          onClose={handleClose(error.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
