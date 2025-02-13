import { CircleX } from "lucide-react";

type Props = {
  message: string;
  onClose: () => void;
};

const ErrorToast = ({ message, onClose }: Props) => (
  <div
    role="alert"
    className="alert alert-error shadow-lg transition-all duration-300 ease-in-out opacity-100 translate-y-0
                     animate-fade-in animate-slide-up"
    onClick={onClose}
  >
    <CircleX />
    <span>{message}</span>
  </div>
);

export default ErrorToast;
