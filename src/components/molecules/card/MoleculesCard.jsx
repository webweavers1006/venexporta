import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const CustomCard = ({ header, children, footer }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        {header}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="flex-col gap-2 text-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default CustomCard;