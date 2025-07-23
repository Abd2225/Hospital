import { Link } from "react-router-dom"
import { FaHospital, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-6">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold mb-4">
            <FaHospital className="text-white text-3xl" />
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">SYMEDICA</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            SYMEDICA is your trusted healthcare companion, helping you find the best medical facilities and book
            appointments with ease.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-slate-600 transition-all duration-200 hover:scale-110"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-slate-600 transition-all duration-200 hover:scale-110"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-slate-600 transition-all duration-200 hover:scale-110"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-slate-600 transition-all duration-200 hover:scale-110"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Quick Links</h3>
          <ul className="space-y-3 text-slate-300">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/hospitals" className="hover:text-white transition-colors duration-200">
                Hospitals
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Doctors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Medicines
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                About Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Services</h3>
          <ul className="space-y-3 text-slate-300">
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Hospital Finder
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Appointment Booking
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Medicine Information
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Emergency Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Health Articles
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Contact Us</h3>
          <ul className="space-y-4 text-slate-300 text-sm">
            <li className="flex gap-3 items-start">
              <i className="fas fa-map-marker-alt text-slate-400 mt-1" />
              123 Healthcare St, Medical District, NY 10001
            </li>
            <li className="flex gap-3 items-center">
              <i className="fas fa-phone-alt text-slate-400" />
              +1 (800) 123-4567
            </li>
            <li className="flex gap-3 items-center">
              <i className="fas fa-envelope text-slate-400" />
              info@symedica.com
            </li>
            <li className="flex gap-3 items-center">
              <i className="fas fa-clock text-slate-400" />
              24/7 Support Available
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 mt-10 pt-6 text-center text-slate-400 text-sm">
        &copy; 2023 SYMEDICA. All Rights Reserved. |{" "}
        <a href="#" className="text-slate-300 hover:underline">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="#" className="text-slate-300 hover:underline">
          Terms of Service
        </a>
      </div>
    </footer>
  )
}

export default Footer
