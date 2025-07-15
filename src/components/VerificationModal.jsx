import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verificationCodeSchema } from "@/schema/verificationCodeSchema";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@src/components/ui/form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "@src/components/ui/Modal";

export function VerificationModal({ isOpen, onClose, email }) {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  const handleVerify = async (data) => {
    try {
      await axios.post("https://venexporta-rn.com/api/no_reply/change_pass", { correo: email, codigo: data.code, pass: data.newPassword });
      alert("Código y nueva clave verificados correctamente.");
      onClose();
      navigate("/login"); // Redirigir al login
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || "Error al verificar el código. Inténtelo de nuevo.";
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verificar Usuario">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleVerify)}>
          <div className="grid gap-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123456" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Ingrese una Nueva Contraseña" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-white py-2 rounded-md">
              Validar
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}