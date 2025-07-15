import { useState } from "react";
import { VerificationModal } from "./VerificationModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schema/forgotPasswordSchema";
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@src/components/ui/form";
import axios from "axios";

function ForgotPasswordForm({ className, ...props }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      correo: "",
    },
  });

  const handleSubmit = async (data) => {
    try {
      await axios.post("https://venexporta-rn.com/api/no_reply/verification_user", data);
      setEmail(data.correo);
      setIsModalOpen(true);
      alert("Código de verificación enviado a su correo.");
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || "Error al enviar el correo. Inténtelo de nuevo.";
      alert(errorMessage);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingrese su correo para recibir el código de verificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6">
                <FormField
                  name="correo"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="correo@ejemplo.com" name="correo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary text-white py-2 rounded-md">
                  Enviar Código
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <VerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={email} />
    </div>
  );
}

export default ForgotPasswordForm;