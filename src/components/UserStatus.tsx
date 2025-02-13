import { useAuthStore } from "../stores/auth.ts";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const UserStatus = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    void navigate("/login");
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost flex items-center gap-2">
        <div className="avatar">
          <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content grid place-items-center text-lg font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <span className="hidden sm:inline">{user?.name}</span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-36"
      >
        <li>
          <button className="btn btn-ghost btn-error" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserStatus;
