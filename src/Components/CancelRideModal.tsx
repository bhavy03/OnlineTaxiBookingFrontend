"use client";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CancelRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
  rideAmount: number; 
}

const cancellationReasons = [
  { id: "1", name: "Driver took too long to arrive" },
  { id: "2", name: "Found another ride" },
  { id: "3", name: "Change of plans" },
  { id: "4", name: "Mistakenly Booked the Ride" },
  { id: "5", name: "Other" },
];

function classNames(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export const CancelRideModal = ({
  isOpen,
  onClose,
  onConfirmCancel,
  rideAmount,
}: CancelRideModalProps) => {
  const [selectedReason, setSelectedReason] = useState(
    cancellationReasons[0].name
  ); 

  const handleConfirm = () => {
    onConfirmCancel(selectedReason); 
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:block"
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-2xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">

                <div className="sm:col-span-12 lg:col-span-12">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                    Cancel Ride
                  </h2>
                  <section
                    aria-labelledby="cancellation-info-heading"
                    className="mt-4"
                  >
                    <h3 id="cancellation-info-heading" className="sr-only">
                      Cancellation Information
                    </h3>

                    <p className="text-lg text-gray-700">
                      Cancelling this ride may incur a deduction of:
                      <span className="font-bold text-red-600 ml-2">
                      ₹ {rideAmount.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      (This amount may vary based on cancellation policy.)
                    </p>
                  </section>
                  <section aria-labelledby="reasons-heading" className="mt-8">
                    <h3
                      id="reasons-heading"
                      className="text-lg font-medium text-gray-900"
                    >
                      Reason for cancellation
                    </h3>

                    <form>
                      <fieldset
                        aria-label="Choose a cancellation reason"
                        className="mt-4"
                      >
                        <RadioGroup
                          value={selectedReason}
                          onChange={setSelectedReason}
                          className="space-y-4"
                        >
                          {cancellationReasons.map((reason) => (
                            <Radio
                              key={reason.id}
                              value={reason.name}
                              className={({ checked }) =>
                                classNames(
                                  "relative flex cursor-pointer rounded-lg px-5 py-4 shadow-sm focus:outline-none",
                                  checked
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-900 hover:bg-gray-50",
                                  "ring-1 ring-inset ring-gray-300" 
                                )
                              }
                            >
                              {({ checked }) => (
                                <>
                                  <span className="flex flex-1">
                                    <span className="flex flex-col">
                                      <span className="block text-sm font-medium">
                                        {reason.name}
                                      </span>
                                    </span>
                                  </span>
                                  {checked && (
                                    <XMarkIcon
                                      className="size-5 text-white"
                                      aria-hidden="true"
                                    /> 
                                  )}
                                  <span
                                    className={classNames(
                                      checked
                                        ? "border-indigo-600"
                                        : "border-transparent",
                                      "pointer-events-none absolute -inset-px rounded-lg border-2"
                                    )}
                                    aria-hidden="true"
                                  />
                                </>
                              )}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </fieldset>

                      <button
                        type="button" 
                        onClick={handleConfirm}
                        className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden"
                      >
                        Confirm Cancellation
                      </button>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
