import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";

const AtomsPopoverHelpButton = ({ title, content, icon, className, side, classNameContent }) => (
  <div className={className}>
    <Popover>
      <PopoverTrigger asChild>
          {icon ? icon : <CircleHelp color="#2D044A"/>}
      </PopoverTrigger>
      <PopoverContent className={`bg-white ${classNameContent}`} side={side}>
        <div>
          <p className="text-sm font-semibold text-zinc-900">{title}</p>
          <div className="mt-2">{content}</div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

export default AtomsPopoverHelpButton;
