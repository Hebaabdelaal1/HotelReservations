import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRooms } from '../features/rooms/roomsSlice'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const dispatch = useDispatch()
  const { items: rooms, status } = useSelector((state) => state.rooms)
  const [filtered, setFiltered] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("") 
  const itemsPerPage = 8

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])


  useEffect(() => {
    let updated = [...rooms]


    const term = localStorage.getItem('searchTerm')?.toLowerCase() || ''
    setSearchTerm(term) 
    
    if (term) {
      updated = updated.filter(room =>
        room.title.toLowerCase().includes(term) ||
        room.type.toLowerCase().includes(term) ||
        room.price.toString().includes(term)
      )
    }

   
    if (typeFilter) {
      updated = updated.filter(room => room.type === typeFilter)
    }


    if (availabilityFilter) {
      if (availabilityFilter === "available") {
        updated = updated.filter(r => r.available)
      }
      if (availabilityFilter === "booked") {
        updated = updated.filter(r => !r.available)
      }
    }

   
    if (sortOrder === "asc") {
      updated.sort((a, b) => a.price - b.price)
    }
    if (sortOrder === "desc") {
      updated.sort((a, b) => b.price - a.price)
    }

    setFiltered(updated)
    setCurrentPage(1) 

    if (term && updated.length === 0) {
      toast.error('No rooms match your search', { 
        position: 'top-center', 
        duration: 2000 
      })
    }
  }, [rooms, typeFilter, availabilityFilter, sortOrder])

  useEffect(() => {
    const handleSearchChange = () => {
      const term = localStorage.getItem('searchTerm')?.toLowerCase() || ''
      setSearchTerm(term)
      
      let updated = [...rooms]

      if (term) {
        updated = updated.filter(room =>
          room.title.toLowerCase().includes(term) ||
          room.type.toLowerCase().includes(term) ||
          room.price.toString().includes(term)
        )
      }


      if (typeFilter) {
        updated = updated.filter(room => room.type === typeFilter)
      }
      
      if (availabilityFilter) {
        if (availabilityFilter === "available") {
          updated = updated.filter(r => r.available)
        }
        if (availabilityFilter === "booked") {
          updated = updated.filter(r => !r.available)
        }
      }
      
      if (sortOrder === "asc") {
        updated.sort((a, b) => a.price - b.price)
      }
      if (sortOrder === "desc") {
        updated.sort((a, b) => b.price - a.price)
      }

      setFiltered(updated)
      setCurrentPage(1)

      if (term && updated.length === 0) {
        toast.error('No rooms match your search', { 
          position: 'top-center', 
          duration: 2000 
        })
      }
    }

    window.addEventListener('storage', handleSearchChange)
    
  
    handleSearchChange()
    
    return () => window.removeEventListener('storage', handleSearchChange)
  }, [rooms, typeFilter, availabilityFilter, sortOrder])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-xl text-gray-600">Loading rooms...</p>
      </div>
    )
  }
  
  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-xl text-red-600">Failed to load rooms.</p>
      </div>
    )
  }
  
  if (status === 'succeeded' && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-xl text-gray-600">No rooms available.</p>
      </div>
    )
  }

  
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentRooms = filtered.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen pb-12">
      <Toaster />

      <div
        className="relative w-full h-[400px] sm:h-[500px] mb-8"
        style={{
          backgroundImage: "url('images/welcome.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0  bg-opacity-40 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl sm:text-6xl font-bold mb-2">Luxury Hotel</h1>
          <p className="text-lg sm:text-2xl">Welcome to your favorite place to stay and relax</p>
        </div>
      </div>

   
      {searchTerm && (
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <p className="text-gray-600">
            Search results for: <span className="font-semibold text-blue-600">"{searchTerm}"</span>
            {filtered.length > 0 && (
              <span> - Found {filtered.length} room{filtered.length !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
      )}

  
      <div className="flex flex-wrap justify-end gap-4 max-w-6xl mx-auto px-4 mb-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort by price</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>


      {currentRooms.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500 mb-4">No rooms found.</p>
          {searchTerm && (
            <button
              onClick={() => {
                localStorage.removeItem('searchTerm')
                window.dispatchEvent(new Event('storage'))
              }}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentRooms.map((room) => (
              <div key={room.id} className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <img src={room.image} alt={room.title} className="w-full h-52 object-cover" />
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${room.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {room.available ? "Available" : "Booked"}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{room.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">Type: {room.type}</p>
                  <p className="text-gray-800 font-bold mb-2">${room.price} / night</p>
                  <Link
                    to={`/room/${room.id}`}
                    className="block mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-10 mb-8 px-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 rounded-full font-semibold transition-all ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border hover:bg-blue-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}