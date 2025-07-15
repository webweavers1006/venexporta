import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

  const PopoverComponent = ({ children, trigger }) => {
    return (
      <Popover >
        <PopoverTrigger className="fixed bottom-2 right-2 bg-white py-2 px-2 rounded-full">{trigger}</PopoverTrigger>
        <PopoverContent>{children}</PopoverContent>
      </Popover>
    )
  }

  export default PopoverComponent