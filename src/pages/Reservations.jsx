import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeReservation } from "../features/reservations/reservationsSlice";
import { cancelBooking } from "../features/rooms/roomsSlice";
import toast, { Toaster } from "react-hot-toast";
// import { format } from "date-fns";

const Reservations = () => {
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.reservations.items);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const userReservations = reservations.filter((res) => res.userId === user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const openModal = (res) => {
    setSelectedReservation(res);
    setModalOpen(true);
  };

  const confirmCancel = () => {
    if (selectedReservation) {
      dispatch(removeReservation(selectedReservation.id));
      dispatch(cancelBooking(selectedReservation.roomId));
      
      toast.success("Reservation canceled successfully!", {
        position: "top-center",
        duration: 2000,
      });
    }
    setModalOpen(false);
    setSelectedReservation(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your reservations</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        My Reservations
      </h2>

      {userReservations.length === 0 ? (
        <p className="text-gray-500 text-lg text-center mt-20">
          You have no reservations yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userReservations.map((res) => (
            <div
              key={res.id}
              className="relative bg-white shadow-lg rounded-xl p-5 border border-gray-200 flex flex-col transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <span className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 text-xs rounded-full font-semibold">
                Booked
              </span>

              <img
                src={res.roomImage || res.image || "/default-room.jpg"}
                alt={res.roomTitle || res.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {res.roomTitle || res.title}
              </h3>
              <p className="text-gray-600 mb-1">
                Price: ${res.roomPrice || res.price} / night
              </p>
              <p className="text-gray-600 mb-1">
                Check-in: {res.checkIn || res.dates?.start}
              </p>
              <p className="text-gray-600 mb-3">
                Check-out: {res.checkOut || res.dates?.end}
              </p>
              {res.nights && (
                <p className="text-gray-600 mb-1">Nights: {res.nights}</p>
              )}
              {res.totalPrice && (
                <p className="text-gray-800 font-bold mb-3">Total: ${res.totalPrice}</p>
              )}
              <button
                onClick={() => openModal(res)}
                className="mt-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancel Reservation
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
            <p className="mb-6">Are you sure you want to cancel this reservation?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;