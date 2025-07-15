import { FaFacebook, FaInstagram, FaGithub, FaGlobe } from "react-icons/fa"

export function SocialLinks({ facebook, instagram, github, website }) {
  return (
    <div className="flex gap-4">
      {facebook && (
        <a href={facebook} className="text-gray-400 hover:text-blue-500">
          <FaFacebook className="w-5 h-5" />
        </a>
      )}
      {instagram && (
        <a href={instagram} className="text-gray-400 hover:text-blue-500">
          <FaInstagram className="w-5 h-5" />
        </a>
      )}
      {github && (
        <a href={github} className="text-gray-400 hover:text-blue-500">
          <FaGithub className="w-5 h-5" />
        </a>
      )}
      {website && (
        <a href={website} className="text-gray-400 hover:text-blue-500">
          <FaGlobe className="w-5 h-5" />
        </a>
      )}
    </div>
  )
}