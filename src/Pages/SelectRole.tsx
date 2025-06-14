import { Link } from "react-router";

export const SelectRole = () => {
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="mb-8 text-center font-semibold">
          <h1>Select Your Role</h1>
          <p>Please choose whether you are a User or a Driver to proceed.</p>
        </div>
        <div className="flex space-x-4 ">
          <Link to="/user" className="border px-2 rounded">
            User
          </Link>
          <Link to="/driver" className="border px-2 rounded">
            Driver
          </Link>
        </div>
      </div>
    </>
  );
};
