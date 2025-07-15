import mask from '@assets/logo/mask3.png';
import { ArrowLeft, ArrowRight } from "lucide-react";

const AtomsPanel = ({ title, subtitle, children }) => {
  return (
    <div className="bg-primary pt-10 pb-10 px-5 rounded-2xl md:col-span-2 relative">
      
      <div className='absolute top-3 right-3 bg-zinc-600 p-1 rounded-lg flex gap-2'>
        <button
          className="rounded-full hover:bg-white/10 transition-colors"
          onClick={() => window.history.back()}
          aria-label="Volver"
          type="button"
        >
          <ArrowLeft className="text-white w-full"/>
        </button>
        <button
          className="rounded-full hover:bg-white/10 transition-colors"
          onClick={() => window.history.forward()}
          aria-label="Adelante"
          type="button"
        >
          <ArrowRight className="text-white w-full"/>
        </button>
      </div>
      <div className="flex items-center">
        {children ? (
          <div className="flex-shrink-0">{children}</div>
        ) : (
          <img className="mask mask-squircle size-25" src={mask} />
        )}
        <div className="flex flex-col justify-center ml-4">
          <h2 className="text-4xl text-white font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="text-base/7 font-semibold text-gray-300">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AtomsPanel;