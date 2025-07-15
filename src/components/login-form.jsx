import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/loginSchema";
import { cn } from "@src/lib/utils";
import { Button } from "@src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { Input } from "@src/components/ui/input";
import { Link } from "react-router";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@src/components/ui/form";
import { useHandlers } from "@src/pages/centerLogin/handlers/handlersCenterLogin";

export function LoginForm({ className, ...props }) {
  const { handleSubmit } = useHandlers();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user: "",
      pass: "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido a Venexporta</CardTitle>
          <CardDescription>
            Inicia Sesion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6">
                <FormField
                  name="user"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="m@example.com" name="user" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="pass"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Contraseña</FormLabel>
                        <Link to="/forgot-password" className="text-sm underline-offset-4 hover:underline">
                          Olvide mi contraseña
                        </Link>
                      </div>
                      <FormControl>
                        <Input {...field} type="password" name="pass" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Ingresar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-white">
        No posees una cuenta?{" "}
        <Link to="/signup" className="underline underline-offset-4">
          Registrarme
        </Link>
      </div>
    </div>
  );
}