import { Link } from "react-router-dom"
import { FaSearch, FaCalendarAlt, FaUserMd } from "react-icons/fa"

const howItWorksItems = [
  {
    icon: <FaSearch className="text-blue-600 w-5 h-5" />,
    title: "Search Hospitals",
    desc: "Find hospitals by specialty, location, or ratings",
  },
  {
    icon: <FaCalendarAlt className="text-blue-600 w-5 h-5" />,
    title: "Book Appointment",
    desc: "Select your preferred date and time",
  },
  {
    icon: <FaUserMd className="text-blue-600 w-5 h-5" />,
    title: "Visit Doctor",
    desc: "Receive quality healthcare from specialists",
  },
]

const HomePage = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center rounded-xl text-white flex flex-col justify-center items-start px-10 mt-6"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3')",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold max-w-xl mb-6">Find Quality Healthcare Near You</h1>
        <p className="text-lg max-w-md mb-6">
          Book appointments with top-rated hospitals and specialists in your area with just a few clicks.
        </p>
        <Link
          to="/hospitals"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Browse Hospitals
        </Link>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 my-20">
        <h2 className="text-3xl font-semibold text-slate-800 mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white rounded-xl shadow-sm my-20 max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-blue-600 text-3xl font-bold mb-6">About SYMEDICA</h2>
          <p className="text-slate-600 mb-4">
            SYMEDICA is a revolutionary healthcare platform connecting patients with the best medical facilities in
            their area. Founded in 2020, our mission is to make quality healthcare accessible to everyone through
            technology.
          </p>
          <p className="text-slate-600 mb-4">
            We partner with over 500 hospitals and clinics nationwide, offering comprehensive information, appointment
            booking, and medical resources all in one place.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-2">
                <i className="fas fa-check-circle" /> Our Vision
              </h3>
              <p className="text-slate-500 text-sm">
                To transform healthcare accessibility through innovative digital solutions.
              </p>
            </div>
            <div>
              <h3 className="text-blue-600 font-semibold flex items-center gap-2 mb-2">
                <i className="fas fa-users" /> Our Team
              </h3>
              <p className="text-slate-500 text-sm">
                Healthcare professionals and technology experts working together.
              </p>
            </div>
          </div>
          <button className="mt-6 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition">
            Learn More About Us
          </button>
        </div>
        <div className="flex-1 rounded-xl overflow-hidden h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3"
            alt="Healthcare"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  )
}

export default HomePage
