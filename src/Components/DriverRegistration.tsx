import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router"; // Use react-router-dom for Link and useNavigate
import { useAppDispatch } from "../store/hooks"; // Assuming your Redux setup
import { setIsAuthenticated } from "../features/userSlice"; // Assuming your Redux setup
import { CarTypes } from "../constants/CarTypes";

export const DriverRegistration = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [carType, setCarType] = useState<
    (typeof CarTypes)[keyof typeof CarTypes] | null
  >(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneNoError, setPhoneNoError] = useState<string | null>(null);
  const [licenseNumberError, setLicenseNumberError] = useState<string | null>(
    null
  );
  const [carTypeError, setCarTypeError] = useState<string | null>(null);

  const GMAIL_REGEX = /^[^@\s]+@gmail\.com$/;
  const PHONE_REGEX = /^\d{10}$/;
  const LICENSE_REGEX = /^[A-Z0-9]{5,15}$/;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.trim() === "") {
      setEmailError("Email address is required.");
    } else if (!GMAIL_REGEX.test(newEmail)) {
      setEmailError("Email must be a Gmail address.");
    } else {
      setEmailError(null);
    }
  };

  const handlePhoneNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNo(value);
    if (value.trim() === "") {
      setPhoneNoError("Phone number is required.");
    } else if (!PHONE_REGEX.test(value)) {
      setPhoneNoError("Phone number must be exactly 10 digits.");
    } else {
      setPhoneNoError(null);
    }
  };

  const handleLicenseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLicenseNumber(value);
    if (value.trim() === "") {
      setLicenseNumberError("License number is required.");
    } else if (!LICENSE_REGEX.test(value)) {
      setLicenseNumberError(
        "License number must be 5-15 alphanumeric characters."
      );
    } else {
      setLicenseNumberError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required.");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (email.trim() === "") {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (!GMAIL_REGEX.test(email)) {
      setEmailError("Email must be a Gmail address.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (password.trim() === "") {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (phoneNo.trim() === "") {
      setPhoneNoError("Phone number is required.");
      isValid = false;
    } else if (!PHONE_REGEX.test(phoneNo)) {
      setPhoneNoError("Phone number must be exactly 10 digits.");
      isValid = false;
    } else {
      setPhoneNoError(null);
    }

    if (licenseNumber.trim() === "") {
      setLicenseNumberError("License number is required.");
      isValid = false;
    } else if (!LICENSE_REGEX.test(licenseNumber)) {
      setLicenseNumberError(
        "License number must be 5-15 alphanumeric characters."
      );
      isValid = false;
    } else {
      setLicenseNumberError(null);
    }

    if (!isValid) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    let carTypeValue: number | null = null;
    if (carType !== null) {
      switch (carType) {
        case CarTypes.CabEconomy:
          carTypeValue = 1;
          break;
        case CarTypes.Sedan:
          carTypeValue = 2;
          break;
        case CarTypes.CabPremium:
          carTypeValue = 3;
          break;
        case CarTypes.Suv:
          carTypeValue = 4;
          break;
        default:
          console.error("Unknown CarType selected:", carType);
          setCarTypeError(null);
          toast.error("Invalid car type selected.");
          return;
      }
    } else {
      setCarTypeError("Please select a car type.");
      isValid = false;
      toast.error("Car type is required.");
      return;
    }

    const requestBody = {
      user: {
        name: name,
        email: email,
        password: password, 
        phoneNo: phoneNo,
      },
      licenseNumber: licenseNumber,
      carType: carTypeValue, 
      isAvailable: true, 
    };

    try {
      const response = await fetch("https://localhost:7011/driver/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem("userEmail", data.name);
        localStorage.setItem("taxiToken", data.token);
        dispatch(setIsAuthenticated(true));
        toast.success("Driver registered successfully!");
        setTimeout(() => {
          navigate("/driver");
        }, 1000);
        setName("");
        setEmail("");
        setPassword("");
        setPhoneNo("");
        setLicenseNumber("");
        setCarType(null);
      } else {
        const errorMessage =
          data.message || "Registration failed. Please try again.";
        toast.error(errorMessage);
        console.error("Driver registration failed:", data);
      }
    } catch (error) {
      console.error("Network or API error during driver registration:", error);
      toast.error("An unexpected error occurred during registration.");
    }
  };

  function classNames(
    ...classes: (string | boolean | undefined | null)[]
  ): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
        {" "}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Register your driver account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-lg shadow-lg">
          {" "}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
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
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(
                      e.target.value.trim() === "" ? "Name is required." : null
                    );
                  }}
                  placeholder="Enter your full name"
                  className={classNames(
                    "block w-full rounded-md  p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    nameError
                      ? "ring-red-500 focus:ring-red-500"
                      : "focus:ring-indigo-600"
                  )}
                />
              </div>
              {nameError && (
                <p className="mt-2 text-sm text-red-600">{nameError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your Gmail address"
                  className={classNames(
                    "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    emailError
                      ? "ring-red-500 focus:ring-red-500"
                      : "focus:ring-indigo-600"
                  )}
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(
                      e.target.value.trim() === ""
                        ? "Password is required."
                        : null
                    );
                  }}
                  placeholder="Create a password"
                  className={classNames(
                    "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    passwordError
                      ? "ring-red-500 focus:ring-red-500"
                      : "focus:ring-indigo-600"
                  )}
                />
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phoneNo"
                  name="phoneNo"
                  type="text"
                  maxLength={10}
                  required
                  value={phoneNo}
                  onChange={handlePhoneNoChange}
                  placeholder="Enter 10-digit phone number"
                  className={classNames(
                    "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    phoneNoError
                      ? "ring-red-500 focus:ring-red-500"
                      : "focus:ring-indigo-600"
                  )}
                />
              </div>
              {phoneNoError && (
                <p className="mt-2 text-sm text-red-600">{phoneNoError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Driving License Number
              </label>
              <div className="mt-2">
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={handleLicenseNumberChange}
                  placeholder="Enter license number"
                  className={classNames(
                    "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    licenseNumberError
                      ? "ring-red-500 focus:ring-red-500"
                      : "focus:ring-indigo-600"
                  )}
                />
              </div>
              {licenseNumberError && (
                <p className="mt-2 text-sm text-red-600">
                  {licenseNumberError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="carType"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Car Type
              </label>
              <div className="mt-2">
                <select
                  id="carType"
                  name="carType"
                  required
                  value={carType || ""}
                  onChange={(e) => {
                    setCarType(
                      e.target.value as (typeof CarTypes)[keyof typeof CarTypes]
                    );
                    setCarTypeError(null);
                  }}
                  className={classNames(
                    "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    carTypeError
                      ? "ring-red-500 focus:ring-red-500"
                      : "focus:ring-indigo-600"
                  )}
                >
                  <option value="" disabled>
                    Select your car type
                  </option>{" "}
                  {Object.values(CarTypes).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {carTypeError && (
                <p className="mt-2 text-sm text-red-600">{carTypeError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already a driver?{" "}
            <Link
              to="/driver/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
