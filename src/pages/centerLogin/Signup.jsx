import OrganismsRegister from "@components/organisms/register/OrganismsRegister";
import PopoverComponent from '@components/molecules/Popover';
import ayuda from '@assets/logo/ayuda.jpg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleHelp } from 'lucide-react';
export function CenterRegiter({ className, ...props }) {
 

  return (
    <section className="hero is-fullheight">
        <div className="hero-body is-centered">
                <PopoverComponent trigger={<CircleHelp className='text-primary' />}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">¿Necesitas ayuda?</CardTitle>
                            <CardDescription>Estamos aquí para ayudarte</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                <img src={ayuda} alt="ayuda" />
                            </CardDescription>
                        </CardContent>
                    </Card>
                </PopoverComponent>
            <OrganismsRegister/>
        </div>
    </section>
  );
}

export default CenterRegiter;