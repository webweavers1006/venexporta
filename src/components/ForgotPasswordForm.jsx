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

//✅Components traduction
import { useTranslation } from "react-i18next";

function ForgotPasswordForm({ className, ...props }) {
  const { t } = useTranslation();
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
      alert(t("verification_sent"));
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || t("verification_error");
      alert(errorMessage);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("recover_title")}</CardTitle>
          <CardDescription>{t("recover_description")}</CardDescription>
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
                      <FormLabel>{t("recover_email_label")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("recover_email_placeholder")} name="correo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary text-white py-2 rounded-md">
                  {t("recover_button")}
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