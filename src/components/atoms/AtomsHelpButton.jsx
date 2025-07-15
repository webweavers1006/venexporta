import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CircleHelp } from "lucide-react";

const AtomsHelpButton = ({ title, content, icon, className }) => (
    <div className={className}>
        <Tooltip trigger={["click"]}>
            <TooltipTrigger asChild >
                <CircleHelp color="#bf0d0d"/>
            </TooltipTrigger>
            <TooltipContent className="bg-white" side="left">
            <div>
                <strong className="text-sm font-semibold text-zinc-900">{title}</strong>
                <div className="mt-2">{content}</div>
            </div>
            </TooltipContent>
        </Tooltip>
    </div >
);

export default AtomsHelpButton;
