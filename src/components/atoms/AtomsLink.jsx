import { Link } from "react-router";

const AtomsLink = ({config}) => {
    return (
    <Link className="bg-primary justify-center text-white py-1 dark:text-white dark:opacity-80 text-base ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4  text-slate-700 transition-colors" to={config.link}>
        {config.text}
    </Link>
    );
};
export default AtomsLink;