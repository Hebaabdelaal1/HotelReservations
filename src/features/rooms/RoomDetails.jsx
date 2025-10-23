import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addReservation } from "../reservations/reservationsSlice";
import { bookRoom } from "./roomsSlice";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const rooms = useSelector((state) => state.rooms.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: reservations } = useSelector((state) => state.reservations);

  const room = rooms.find((r) => r.id === id);

  if (!room)
    return (
      <div style={{ textAlign: "center", padding: "80px", fontSize: "1.2rem" }}>
        <p>Room not found.</p>
      </div>
    );

  const calculateNights = () => {
    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * room.price;

  const handleBook = () => {
 
    if (!isAuthenticated) {
      toast.error("Please login to book a room!", {
        duration: 3000,
        position: "top-center",
        style: { background: "#dc3545", color: "white", fontWeight: "500" },
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

 
    if (!room.available) {
      toast.error("This room is already booked!", { 
        duration: 3000, 
        position: "top-center" 
      });
      return;
    }


    const start = format(dateRange[0].startDate, "yyyy-MM-dd");
    const end = format(dateRange[0].endDate, "yyyy-MM-dd");

    if (start === end) {
      toast.error("Please select at least one night!", { 
        duration: 3000, 
        position: "top-center" 
      });
      return;
    }


    const existingBooking = reservations.find(
      (res) => res.roomId === room.id && res.userId === user?.id
    );
    
    if (existingBooking) {
      toast.error("You already booked this room!", { 
        duration: 3000, 
        position: "top-center" 
      });
      return;
    }

  
    const newReservation = {
      roomId: room.id,
      roomTitle: room.title,
      roomType: room.type,
      roomPrice: room.price,
      roomImage: room.image,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      checkIn: start,
      checkOut: end,
      nights: nights,
      totalPrice: totalPrice,
    };


    dispatch(addReservation(newReservation));
    dispatch(bookRoom(room.id));

    toast.success(`You successfully booked ${room.title}!`, {
      duration: 3000,
      position: "top-center",
      style: { background: "#007bff", color: "white", fontWeight: "500" },
    });

    setTimeout(() => navigate("/reservations"), 2000);
  };

  return (
    <div style={styles.container}>
      <Toaster />
      <div style={{ position: "relative" }}>
        <img src={room.image} alt={room.title} style={styles.image} />
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: "600",
            color: room.available ? "#155724" : "#721c24",
            backgroundColor: room.available ? "#d4edda" : "#f8d7da",
          }}
        >
          {room.available ? "Available" : "Booked"}
        </span>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>{room.title}</h2>
        <p style={styles.subtitle}>{room.type} • {room.capacity} guests</p>
        <p style={styles.description}>{room.description}</p>

        <h4 style={styles.amenitiesTitle}>Amenities:</h4>
        <ul style={styles.amenitiesList}>
          {room.amenities.map((a) => (
            <li key={a} style={styles.amenityItem}>
              <FiCheckCircle color="#007bff" /> {a}
            </li>
          ))}
        </ul>


        {room.available && isAuthenticated && (
          <div style={{ margin: "20px 0" }}>
            <h4 style={styles.amenitiesTitle}>Select your stay dates:</h4>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              rangeColors={["#007bff"]}
              minDate={new Date()}
            />
            <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <p style={{ margin: "5px 0", fontSize: "0.95rem", color: "#444" }}>
                <strong>Check-in:</strong> {format(dateRange[0].startDate, "MMM dd, yyyy")}
              </p>
              <p style={{ margin: "5px 0", fontSize: "0.95rem", color: "#444" }}>
                <strong>Check-out:</strong> {format(dateRange[0].endDate, "MMM dd, yyyy")}
              </p>
              {nights > 0 && (
                <p style={{ margin: "10px 0 5px", fontSize: "1rem", color: "#007bff", fontWeight: "600" }}>
                  {nights} night{nights > 1 ? 's' : ''} × ${room.price} = <strong>${totalPrice}</strong>
                </p>
              )}
            </div>
          </div>
        )}


        {!isAuthenticated && (
          <div style={styles.loginMessage}>
            You need to <a href="/login" style={styles.link}>login</a> or{' '}
            <a href="/signup" style={styles.link}>create an account</a> to book this room.
          </div>
        )}

        <div style={styles.bottom}>
          <div style={styles.priceBox}>
            <span style={styles.price}>${room.price}</span>
            <span style={styles.perNight}> / night</span>
          </div>

          <button
            style={{
              ...styles.button,
              background: room.available ? "#007bff" : "#6c757d",
              cursor: room.available ? "pointer" : "not-allowed",
              opacity: room.available ? 1 : 0.6,
            }}
            onMouseOver={(e) => room.available && (e.target.style.background = "#0056d2")}
            onMouseOut={(e) => room.available && (e.target.style.background = "#007bff")}
            onClick={handleBook}
            disabled={!room.available}
          >
            {room.available 
              ? (isAuthenticated ? "Book Now" : "Login to Book") 
              : "Already Booked"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: "30px 20px", 
    maxWidth: "900px", 
    margin: "0 auto", 
    backgroundColor: "#fff", 
    borderRadius: "16px", 
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)", 
    display: "flex", 
    flexDirection: "column", 
    gap: "20px" 
  },
  image: { 
    width: "100%", 
    maxHeight: "400px", 
    objectFit: "cover", 
    borderRadius: "12px" 
  },
  content: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "10px" 
  },
  title: { 
    fontSize: "2rem", 
    color: "#222" 
  },
  subtitle: { 
    color: "#666", 
    fontSize: "1.1rem" 
  },
  description: { 
    color: "#444", 
    lineHeight: "1.6", 
    fontSize: "1rem" 
  },
  amenitiesTitle: { 
    color: "#333", 
    marginBottom: "6px", 
    fontSize: "1.1rem" 
  },
  amenitiesList: { 
    listStyle: "none", 
    padding: 0, 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "8px 16px", 
    marginBottom: "20px" 
  },
  amenityItem: { 
    color: "#555", 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    fontSize: "0.95rem" 
  },
  bottom: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    borderTop: "1px solid #eee", 
    paddingTop: "20px", 
    flexWrap: "wrap", 
    gap: "15px" 
  },
  priceBox: { 
    display: "flex", 
    alignItems: "baseline" 
  },
  price: { 
    fontSize: "1.6rem", 
    fontWeight: "bold", 
    color: "#007bff" 
  },
  perNight: { 
    color: "#777", 
    marginLeft: "5px" 
  },
  button: { 
    padding: "12px 25px", 
    color: "white", 
    border: "none", 
    borderRadius: "8px", 
    fontSize: "1rem", 
    transition: "0.3s" 
  },
  loginMessage: {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    color: '#856404',
    fontSize: '0.95rem',
    marginTop: '10px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '600',
  },
};