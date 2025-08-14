import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Button } from "@src/components/ui/button";


//✅Components traduction
import { useTranslation } from "react-i18next";
const RegisterFormFields = ({ form, loading }) => {
  const { t } = useTranslation();

  return (
     <div className="grid grid-cols-2 gap-6 mt-8">
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>{t("form_name_label")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("form_name_placeholder")} />
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
            <FormLabel>{t("form_email_label")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("form_email_placeholder")} />
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
            <FormLabel>{t("form_id_label")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("form_id_placeholder")} />
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
            <FormLabel>{t("form_password_label")}</FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder={t("form_password_placeholder")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

  );
};

export default RegisterFormFields;
