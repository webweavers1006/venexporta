const AtomsTitle = ({ title, subtitle, className = "" }) => (
    <div className={`flex flex-col items-center w-full ${className}`}>
        <h2 className="text-center text-zinc-900 font-semibold">{title}</h2>	
        {subtitle && (
            <p className="text-center text-sm text-zinc-600">{subtitle}</p>
        )}
    </div>
);  

export default AtomsTitle;