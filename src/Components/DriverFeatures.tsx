import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

export const DriverFeatures = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    const authenticated = localStorage.getItem("taxiToken") ? true : false;
    if (!authenticated) {
      toast.error("Please login to see available rides");
      navigate("/driver/login");
      return;
    }
  };
  return (
    <>
      <div onClick={handleClick}>
        <Link to="rides/available-rides">Available rides</Link>
        <Link to="rides/accepted-rides">Accepted rides</Link>
        <Link to="rides/declined-rides">Decline rides</Link>
      </div>
    </>
  );
};
