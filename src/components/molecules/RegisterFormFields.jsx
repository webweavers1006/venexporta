import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Button } from "@src/components/ui/button";

const RegisterFormFields = ({ form, loading }) => {
  return (
    <div className="grid grid-cols-2 gap-6 mt-8">
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Nombres y Apellidos</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nombre completo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="email"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Correo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="m@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="identification"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Número de Identificación</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nº Identificación" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="pass"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Contraseña</FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder="Contraseña" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RegisterFormFields;
