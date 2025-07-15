import { ChevronRight } from "lucide-react"
import { Link } from "react-router"
const AtomsBanner = ({ updateLabel, number, Icon, link }) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-auto bg-transparent p-0 animate-slide-in">
    <Link to={link} className="w-full max-w-md">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary rounded-full text-white text-sm font-medium hover:bg-gray-900 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
        {Icon && <Icon className="w-5 h-5 text-green" />}
        <span className="font-semibold">{updateLabel}</span>
        <span className="text-gray-300">·</span>
        <span className="shadcn-badge bg-red-400 text-white px-2 py-0.5 rounded-full text-xs font-bold align-middle ml-1">{number}</span>
        Ir
        <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
    </Link>
  </div>
)

export default AtomsBanner

// Animación CSS (agregar en tu CSS global o en el archivo correspondiente):
// .animate-slide-in {
//   animation: slideInBanner 0.7s cubic-bezier(0.4, 0, 0.2, 1);
// }
// @keyframes slideInBanner {
//   0% { opacity: 0; transform: translateY(-40px) scale(0.95); }
//   100% { opacity: 1; transform: translateY(0) scale(1); }
// }