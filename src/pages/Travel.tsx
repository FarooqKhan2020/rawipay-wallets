import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import ConfirmModal from '../components/ConfirmModal'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, Search, Plane, Clock, Hotel, MapPin, Star, Wifi, Car, Utensils, Bed, ArrowRight, X, Info, Luggage, UtensilsCrossed, Briefcase, Shield, CheckCircle, AlertCircle } from 'lucide-react'

interface Airport {
  code: string
  name: string
  city: string
}

interface Flight {
  id: string
  airline: string
  flightNumber: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  seatsAvailable: number
  aircraft: string
  seatClass?: string
  baggage?: string
  meal?: string
  cancellation?: string
  description?: string
  stops?: number
  layover?: string
  terminal?: string
  gate?: string
  checkIn?: string
  boarding?: string
}

interface Hotel {
  id: string
  name: string
  city: string
  location: string
  rating: number
  price: number
  originalPrice: number
  discount: number
  image: string
  amenities: string[]
  description: string
  distance: string
  roomTypes?: { type: string; description: string; price: number }[]
  policies?: { checkIn: string; checkOut: string; cancellation: string; pets: string }
  facilities?: string[]
  nearby?: string[]
  reviews?: { rating: number; comment: string; author: string }[]
}

function Travel() {
  const { wallets, updateSpending } = useApp()
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights')
  
  // Flight states
  const [searchType, setSearchType] = useState<'one-way' | 'round-trip'>('one-way')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [airports, setAirports] = useState<Airport[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [loadingFlights, setLoadingFlights] = useState(false)
  const [showFlightResults, setShowFlightResults] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [showFlightDetails, setShowFlightDetails] = useState(false)
  
  // Hotel states
  const [hotelCity, setHotelCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [rooms, setRooms] = useState(1)
  const [guests, setGuests] = useState(2)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loadingHotels, setLoadingHotels] = useState(false)
  const [showHotelResults, setShowHotelResults] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [showHotelDetails, setShowHotelDetails] = useState(false)
  const [selectedRoomType, setSelectedRoomType] = useState<string>('')
  
  // Common states
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingType, setBookingType] = useState<'flight' | 'hotel'>('flight')

  const API_BASE = 'http://localhost:3001/api'
  const walletAddress = wallets[0]?.address || '0xBD77...D599B8'

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur',
    'Goa', 'Kochi', 'Ahmedabad', 'Lucknow', 'Chandigarh', 'Indore', 'Nagpur', 'Surat'
  ]

  useEffect(() => {
    fetch(`${API_BASE}/airports/india`)
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((err) => console.error('Error loading airports:', err))
  }, [])

  const handleFlightSearch = async () => {
    if (!from || !to || !departureDate) {
      alert('Please fill in all required fields')
      return
    }

    setLoadingFlights(true)
    try {
      const response = await fetch(`${API_BASE}/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to,
          date: departureDate,
          passengers,
        }),
      })
      const data = await response.json()
      setFlights(data.flights || [])
      setShowFlightResults(true)
    } catch (error) {
      console.error('Error searching flights:', error)
      alert('Error searching flights. Please try again.')
    } finally {
      setLoadingFlights(false)
    }
  }

  const handleHotelSearch = async () => {
    if (!hotelCity || !checkIn || !checkOut) {
      alert('Please fill in all required fields')
      return
    }

    setLoadingHotels(true)
    try {
      const response = await fetch(`${API_BASE}/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: hotelCity,
          checkIn,
          checkOut,
          rooms,
          guests,
        }),
      })
      const data = await response.json()
      setHotels(data.hotels || [])
      setShowHotelResults(true)
    } catch (error) {
      console.error('Error searching hotels:', error)
      alert('Error searching hotels. Please try again.')
    } finally {
      setLoadingHotels(false)
    }
  }

  const handleViewFlightDetails = (flight: Flight) => {
    setSelectedFlight(flight)
    setShowFlightDetails(true)
  }

  const handleViewHotelDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setShowHotelDetails(true)
    if (hotel.roomTypes && hotel.roomTypes.length > 0) {
      setSelectedRoomType(hotel.roomTypes[0].type)
    }
  }

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setBookingType('flight')
    setShowConfirmModal(true)
  }

  const handleBookHotel = (hotel: Hotel) => {
    if (!selectedRoomType && hotel.roomTypes && hotel.roomTypes.length > 0) {
      alert('Please select a room type first')
      return
    }
    setSelectedHotel(hotel)
    setBookingType('hotel')
    setShowConfirmModal(true)
  }

  const confirmBooking = async () => {
    setIsBooking(true)

    try {
      if (bookingType === 'flight' && selectedFlight) {
        const totalPrice = selectedFlight.price * passengers
        const response = await fetch(`${API_BASE}/flights/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            flightId: selectedFlight.id,
            from: selectedFlight.from,
            to: selectedFlight.to,
            departureDate,
            returnDate: searchType === 'round-trip' ? returnDate : null,
            passengers,
            totalPrice,
          }),
        })

        const data = await response.json()
        if (data.error) {
          alert(data.error)
          setShowConfirmModal(false)
        } else {
          setShowConfirmModal(false)
          setSelectedFlight(null)
          setShowFlightResults(false)
          setShowFlightDetails(false)
          updateSpending(totalPrice)
          alert(`Flight booked successfully! Booking ID: ${data.bookingId}`)
        }
      } else if (bookingType === 'hotel' && selectedHotel) {
        const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
        const roomPrice = selectedHotel.roomTypes?.find(r => r.type === selectedRoomType)?.price || selectedHotel.price
        const totalPrice = roomPrice * nights * rooms

        const response = await fetch(`${API_BASE}/hotels/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            hotelId: selectedHotel.id,
            hotelName: selectedHotel.name,
            city: selectedHotel.city,
            checkIn,
            checkOut,
            rooms,
            guests,
            roomType: selectedRoomType,
            totalPrice,
          }),
        })

        const data = await response.json()
        if (data.error) {
          alert(data.error)
          setShowConfirmModal(false)
        } else {
          setShowConfirmModal(false)
          setSelectedHotel(null)
          setShowHotelResults(false)
          setShowHotelDetails(false)
          updateSpending(totalPrice)
          alert(`Hotel booked successfully! Booking ID: ${data.bookingId}`)
        }
      }
    } catch (error) {
      console.error('Error booking:', error)
      alert('Error processing booking. Please try again.')
      setShowConfirmModal(false)
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Travel</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => {
              setActiveTab('flights')
              setShowFlightResults(false)
              setShowHotelResults(false)
            }}
            className={`px-6 py-3 font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'flights'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Plane size={20} />
              <span>Flights</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('hotels')
              setShowFlightResults(false)
              setShowHotelResults(false)
            }}
            className={`px-6 py-3 font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'hotels'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Hotel size={20} />
              <span>Hotels</span>
            </div>
          </button>
        </div>

        {/* Flights Tab */}
        {activeTab === 'flights' && (
          <>
            {/* Search Form */}
            <div className="p-6 mb-6 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-4">
              <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setSearchType('one-way')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                      searchType === 'one-way'
                        ? 'bg-white/[0.06] border border-white/[0.1] text-gray-900 dark:text-white'
                        : 'bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    One Way
                  </button>
                  <button
                    onClick={() => setSearchType('round-trip')}
                    className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                      searchType === 'round-trip'
                        ? 'bg-white/[0.06] border border-white/[0.1] text-gray-900 dark:text-white'
                        : 'bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Round Trip
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">From</label>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                    >
                      <option value="">Select City</option>
                      {airports.map((airport) => (
                        <option key={airport.code} value={airport.code}>
                          {airport.city} ({airport.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">To</label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                    >
                      <option value="">Select City</option>
                      {airports.map((airport) => (
                        <option key={airport.code} value={airport.code}>
                          {airport.city} ({airport.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Departure</label>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  {searchType === 'round-trip' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Return</label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departureDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  )}

                  {searchType === 'one-way' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Passengers</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={passengers}
                          onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                          min={1}
                          max={9}
                          className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                        />
                        <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                  )}
                </div>

                {searchType === 'round-trip' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Passengers</label>
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        value={passengers}
                        onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                        min={1}
                        max={9}
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                      />
                      <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleFlightSearch}
                  disabled={loadingFlights}
                  className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Search size={20} />
                  {loadingFlights ? 'Searching...' : 'Search Flights'}
                </button>
            </div>

            {/* Flight Results */}
            {showFlightResults && flights.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Available Flights</h2>
                {flights.map((flight) => (
                  <div
                    key={flight.id}
                      className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:border-white/[0.08] hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Plane className="text-primary" size={24} />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{flight.airline}</div>
                            <div className="text-sm text-gray-400">{flight.flightNumber}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Departure</div>
                            <div className="font-semibold">{flight.departureTime}</div>
                            <div className="text-sm text-gray-400">{flight.from}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Arrival</div>
                            <div className="font-semibold">{flight.arrivalTime}</div>
                            <div className="text-sm text-gray-400">{flight.to}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Duration</div>
                            <div className="font-semibold flex items-center gap-1">
                              <Clock size={14} />
                              {flight.duration}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Aircraft</div>
                            <div className="font-semibold text-sm">{flight.aircraft}</div>
                            <div className="text-xs text-gray-400">{flight.seatsAvailable} seats left</div>
                          </div>
                        </div>

                        {flight.description && (
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">{flight.description}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">${flight.price.toLocaleString()}</div>
                          <div className="text-sm text-gray-400">for {passengers} passenger{passengers > 1 ? 's' : ''}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewFlightDetails(flight)}
                            className="px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all font-medium flex items-center gap-2"
                          >
                            <Info size={16} />
                            Details
                          </button>
                          <button
                            onClick={() => handleBookFlight(flight)}
                            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-semibold"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showFlightResults && flights.length === 0 && !loadingFlights && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10 p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-30"></div>
                <p className="text-gray-400 relative z-10">No flights found. Please try different dates or routes.</p>
              </div>
            )}
          </>
        )}

        {/* Hotels Tab */}
        {activeTab === 'hotels' && (
          <>
            {/* Search Form */}
            <div className="p-6 mb-6 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                    <select
                      value={hotelCity}
                      onChange={(e) => setHotelCity(e.target.value)}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Rooms & Guests</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={rooms}
                        onChange={(e) => setRooms(parseInt(e.target.value))}
                        className="px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                      >
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>
                            {num} Room{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleHotelSearch}
                  disabled={loadingHotels}
                  className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Search size={20} />
                  {loadingHotels ? 'Searching...' : 'Search Hotels'}
                </button>
            </div>

            {/* Hotel Results */}
            {showHotelResults && hotels.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Available Hotels</h2>
                {hotels.map((hotel) => {
                  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
                  const totalPrice = hotel.price * nights * rooms

                  return (
                    <div
                      key={hotel.id}
                      className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:border-white/[0.08] hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex flex-col md:flex-row">
                        <div className="md:w-80 h-48 bg-gradient-to-br from-white/5 to-white/3 flex items-center justify-center text-6xl border-r border-white/10">
                          {hotel.image}
                        </div>
                        <div className="flex-1 p-6 relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <MapPin size={14} />
                                <span>{hotel.location}, {hotel.city}</span>
                                <span className="mx-2">•</span>
                                <span>{hotel.distance} from city center</span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                                  />
                                ))}
                                <span className="text-sm text-gray-400 ml-2">({hotel.rating})</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl font-bold text-white">${hotel.price}</span>
                                <span className="text-sm text-gray-400 line-through">${hotel.originalPrice}</span>
                                <span className="text-sm text-green-400 font-semibold">{hotel.discount}% off</span>
                              </div>
                              <div className="text-xs text-gray-400">per night</div>
                            </div>
                          </div>

                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                          <div className="flex items-center gap-4 mb-4 flex-wrap">
                            {hotel.amenities.slice(0, 4).map((amenity, i) => (
                              <div key={i} className="flex items-center gap-1 text-sm text-gray-400">
                                {amenity === 'Free WiFi' && <Wifi size={14} />}
                                {amenity === 'Parking' && <Car size={14} />}
                                {amenity === 'Restaurant' && <Utensils size={14} />}
                                {amenity === 'Room Service' && <Bed size={14} />}
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-400">Total for {nights} night{nights > 1 ? 's' : ''} ({rooms} room{rooms > 1 ? 's' : ''})</div>
                              <div className="text-xl font-bold text-white">${totalPrice.toFixed(2)}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewHotelDetails(hotel)}
                                className="px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all font-medium flex items-center gap-2"
                              >
                                <Info size={16} />
                                Details
                              </button>
                              <button
                                onClick={() => handleBookHotel(hotel)}
                                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-semibold flex items-center gap-2"
                              >
                                Book Now
                                <ArrowRight size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {showHotelResults && hotels.length === 0 && !loadingHotels && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10 p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-30"></div>
                <p className="text-gray-400 relative z-10">No hotels found. Please try different dates or city.</p>
              </div>
            )}
          </>
        )}

        {/* Flight Details Modal */}
        <AnimatePresence>
          {showFlightDetails && selectedFlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setShowFlightDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="p-8 bg-white/[0.03] border border-white/[0.05] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Flight Details</h2>
                    <button onClick={() => setShowFlightDetails(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Flight Info */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Plane className="text-primary" size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedFlight.airline}</h3>
                        <p className="text-gray-400">Flight {selectedFlight.flightNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Departure</div>
                        <div className="font-semibold text-lg">{selectedFlight.departureTime}</div>
                        <div className="text-sm text-gray-400">{selectedFlight.from}</div>
                        {selectedFlight.terminal && (
                          <div className="text-xs text-gray-500">Terminal {selectedFlight.terminal}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Arrival</div>
                        <div className="font-semibold text-lg">{selectedFlight.arrivalTime}</div>
                        <div className="text-sm text-gray-400">{selectedFlight.to}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Duration</div>
                        <div className="font-semibold">{selectedFlight.duration}</div>
                        {selectedFlight.stops !== undefined && (
                          <div className="text-xs text-gray-500">
                            {selectedFlight.stops === 0 ? 'Non-stop' : `${selectedFlight.stops} stop${selectedFlight.stops > 1 ? 's' : ''}`}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Aircraft</div>
                        <div className="font-semibold">{selectedFlight.aircraft}</div>
                        <div className="text-xs text-gray-500">{selectedFlight.seatsAvailable} seats left</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedFlight.description && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">About This Flight</h4>
                      <p className="text-gray-300 leading-relaxed">{selectedFlight.description}</p>
                    </div>
                  )}

                    {/* Flight Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedFlight.seatClass && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase size={18} className="text-primary" />
                            <span className="font-semibold">Seat Class</span>
                          </div>
                          <p className="text-gray-300">{selectedFlight.seatClass}</p>
                        </div>
                      )}

                      {selectedFlight.baggage && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Luggage size={18} className="text-primary" />
                            <span className="font-semibold">Baggage</span>
                          </div>
                          <p className="text-gray-300">{selectedFlight.baggage}</p>
                        </div>
                      )}

                      {selectedFlight.meal && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <UtensilsCrossed size={18} className="text-primary" />
                            <span className="font-semibold">Meal</span>
                          </div>
                          <p className="text-gray-300">{selectedFlight.meal}</p>
                        </div>
                      )}

                      {selectedFlight.cancellation && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield size={18} className="text-primary" />
                            <span className="font-semibold">Cancellation</span>
                          </div>
                          <p className="text-gray-300">{selectedFlight.cancellation}</p>
                        </div>
                      )}

                      {selectedFlight.checkIn && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={18} className="text-primary" />
                            <span className="font-semibold">Check-in</span>
                          </div>
                          <p className="text-gray-300">{selectedFlight.checkIn}</p>
                        </div>
                      )}

                      {selectedFlight.boarding && (
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Plane size={18} className="text-primary" />
                            <span className="font-semibold">Boarding</span>
                          </div>
                          <p className="text-gray-300">{selectedFlight.boarding}</p>
                        </div>
                      )}
                    </div>

                    {selectedFlight.layover && (
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle size={18} className="text-yellow-500" />
                          <span className="font-semibold text-yellow-500">Layover Information</span>
                        </div>
                        <p className="text-gray-300">{selectedFlight.layover}</p>
                      </div>
                    )}

                    {/* Price and Book */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-sm text-gray-400">Total Price</div>
                        <div className="text-3xl font-bold text-primary">
                          ${(selectedFlight.price * passengers).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">for {passengers} passenger{passengers > 1 ? 's' : ''}</div>
                      </div>
                      <button
                        onClick={() => {
                          setShowFlightDetails(false)
                          handleBookFlight(selectedFlight)
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-semibold"
                      >
                        Book This Flight
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hotel Details Modal */}
        <AnimatePresence>
          {showHotelDetails && selectedHotel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setShowHotelDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="p-8 bg-white/[0.03] border border-white/[0.05] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Hotel Details</h2>
                    <button onClick={() => setShowHotelDetails(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Hotel Header */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-6xl">{selectedHotel.image}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{selectedHotel.name}</h3>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <MapPin size={16} />
                          <span>{selectedHotel.location}, {selectedHotel.city}</span>
                          <span className="mx-2">•</span>
                          <span>{selectedHotel.distance} from city center</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={i < Math.floor(selectedHotel.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                            />
                          ))}
                          <span className="text-sm text-gray-400 ml-2">({selectedHotel.rating})</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{selectedHotel.description}</p>
                      </div>
                    </div>
                  </div>

                    {/* Room Types */}
                    {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Available Room Types</h4>
                        <div className="space-y-3">
                          {selectedHotel.roomTypes.map((room, i) => (
                            <div
                              key={i}
                              onClick={() => setSelectedRoomType(room.type)}
                              className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-4 border-2 cursor-pointer transition-all ${
                                selectedRoomType === room.type
                                  ? 'border-primary/50 bg-primary/10'
                                  : 'border-white/10 hover:border-primary/30'
                              }`}
                            >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-lg mb-1">{room.type}</div>
                                <p className="text-sm text-gray-400">{room.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-primary">${room.price}</div>
                                <div className="text-xs text-gray-400">per night</div>
                              </div>
                            </div>
                            {selectedRoomType === room.type && (
                              <div className="mt-3 flex items-center gap-2 text-primary">
                                <CheckCircle size={16} />
                                <span className="text-sm">Selected</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                    {/* Amenities */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Amenities</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedHotel.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-300">
                            <CheckCircle size={16} className="text-primary" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Facilities */}
                    {selectedHotel.facilities && selectedHotel.facilities.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Facilities</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedHotel.facilities.map((facility, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-300">
                              <CheckCircle size={16} className="text-primary" />
                              <span>{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Policies */}
                    {selectedHotel.policies && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Hotel Policies</h4>
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4 space-y-3">
                        <div>
                          <span className="font-semibold">Check-in: </span>
                          <span className="text-gray-300">{selectedHotel.policies.checkIn}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Check-out: </span>
                          <span className="text-gray-300">{selectedHotel.policies.checkOut}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Cancellation: </span>
                          <span className="text-gray-300">{selectedHotel.policies.cancellation}</span>
                        </div>
                        {selectedHotel.policies.pets && (
                          <div>
                            <span className="font-semibold">Pets: </span>
                            <span className="text-gray-300">{selectedHotel.policies.pets}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Nearby */}
                  {selectedHotel.nearby && selectedHotel.nearby.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Nearby Attractions</h4>
                      <div className="space-y-2">
                        {selectedHotel.nearby.map((place, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-300">
                            <MapPin size={16} className="text-primary" />
                            <span>{place}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                    {/* Reviews */}
                    {selectedHotel.reviews && selectedHotel.reviews.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Guest Reviews</h4>
                        <div className="space-y-4">
                          {selectedHotel.reviews.map((review, i) => (
                            <div key={i} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm border border-white/10 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, j) => (
                                  <Star
                                    key={j}
                                    size={14}
                                    className={j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold">{review.author}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                    {/* Price and Book */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-sm text-gray-400">Total Price</div>
                        <div className="text-3xl font-bold text-primary">
                          ${(
                            (selectedHotel.roomTypes?.find(r => r.type === selectedRoomType)?.price || selectedHotel.price) *
                            Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) *
                            rooms
                          ).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          for {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} night
                          {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''} ({rooms} room{rooms > 1 ? 's' : ''})
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!selectedRoomType && selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0) {
                            alert('Please select a room type first')
                            return
                          }
                          setShowHotelDetails(false)
                          handleBookHotel(selectedHotel)
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl transition-all font-semibold"
                      >
                        Book This Hotel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        {((selectedFlight && bookingType === 'flight') || (selectedHotel && bookingType === 'hotel')) && (
          <ConfirmModal
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false)
              setSelectedFlight(null)
              setSelectedHotel(null)
            }}
            onConfirm={confirmBooking}
            title={bookingType === 'flight' ? 'Confirm Flight Booking' : 'Confirm Hotel Booking'}
            message={
              bookingType === 'flight' && selectedFlight
                ? (
                    <div className="space-y-2">
                      <p><strong>Airline:</strong> {selectedFlight.airline} {selectedFlight.flightNumber}</p>
                      <p><strong>Route:</strong> {selectedFlight.from} → {selectedFlight.to}</p>
                      <p><strong>Date:</strong> {departureDate}</p>
                      <p><strong>Passengers:</strong> {passengers}</p>
                      {selectedFlight.seatClass && <p><strong>Class:</strong> {selectedFlight.seatClass}</p>}
                      <p className="text-xl font-bold text-primary mt-4">Total: ${(selectedFlight.price * passengers).toFixed(2)}</p>
                    </div>
                  )
                : bookingType === 'hotel' && selectedHotel
                ? (
                    <div className="space-y-2">
                      <p><strong>Hotel:</strong> {selectedHotel.name}</p>
                      <p><strong>Location:</strong> {selectedHotel.city}</p>
                      <p><strong>Check-in:</strong> {checkIn}</p>
                      <p><strong>Check-out:</strong> {checkOut}</p>
                      <p><strong>Rooms:</strong> {rooms} | <strong>Guests:</strong> {guests}</p>
                      {selectedRoomType && <p><strong>Room Type:</strong> {selectedRoomType}</p>}
                      <p className="text-xl font-bold text-primary mt-4">
                        Total: ${(
                          (selectedHotel.roomTypes?.find(r => r.type === selectedRoomType)?.price || selectedHotel.price) *
                          Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) *
                          rooms
                        ).toFixed(2)}
                      </p>
                    </div>
                  )
                : ''
            }
            confirmText="Confirm Booking"
            cancelText="Cancel"
            type="info"
            isLoading={isBooking}
          />
        )}
      </div>
    </div>
  )
}

export default Travel
