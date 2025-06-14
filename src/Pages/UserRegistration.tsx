import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "../store/hooks";
import { setIsAuthenticated } from "../features/userSlice";

export const UserRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [isValidPhoneNo, setIsValidPhoneNo] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const GMAIL_REGEX = /^[^@\s]+@gmail\.com$/;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    if (email.trim() === "") {
      setEmailError("Email address is required.");
      toast.error("Please enter your email address.");
      return;
    } else if (!GMAIL_REGEX.test(email)) {
      setEmailError("Email must be a Gmail address.");
      toast.error("Please enter a valid Gmail address.");
      return;
    }

    if (password.trim() === "") {
      toast.error("Please Enter Password");
    }

    const login = async () => {
      const response = await fetch("https://localhost:7011/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phoneNo }),
      });
      const data = await response.json();
      localStorage.setItem("userEmail", data.name);
      localStorage.setItem("taxiToken", data.token);
    };
    login();
    dispatch(setIsAuthenticated(true));
    toast.success("User registered successfully");
    navigate("/user");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  placeholder="Enter name"
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNo"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Phone Number
              </label>
              {!isValidPhoneNo && phoneNo.length != 0 && (
                <div className="text-sm text-red-500">Enter valid PhoneNo</div>
              )}
              <div className="mt-2">
                <input
                  id="phoneNo"
                  name="phoneNo"
                  type="text"
                  required
                  maxLength={10} 
                  value={phoneNo}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPhoneNo(value);
                    const phoneRegex = /^[0-9]{10}$/;
                    setIsValidPhoneNo(phoneRegex.test(value));
                  }}
                  placeholder="Enter phone number"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
                    !isValidPhoneNo && phoneNo.length != 0
                      ? "outline-red-500 focus:outline-red-500"
                      : "focus:outline-indigo-600" 
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              {emailError && email.length != 0 && (
                <div className="text-sm text-red-500">Enter Valid Email</div>
              )}
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  placeholder="Enter Email address"
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setEmail(newEmail);

                    if (newEmail.trim() === "") {
                      setEmailError("Email address is required.");
                    } else if (!GMAIL_REGEX.test(newEmail)) {
                      setEmailError("Email must be a Gmail address.");
                    } else {
                      setEmailError(null); 
                    }
                  }}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
                    emailError && email.length != 0
                      ? "outline-red-500 focus:outline-red-500"
                      : "focus:outline-indigo-600" 
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already a user?{" "}
            <Link
              to="/user/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign In now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
