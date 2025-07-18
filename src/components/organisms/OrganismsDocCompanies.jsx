import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { docCompaniesSchema } from "@src/schema/docCompaniesSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import { fetchTiposArchivo } from "@src/lib/api/apiIndex";

const DocCompanies = ({ companyId, onSubmit: onSubmitProp, className = "" }) => {
  const form = useForm({
    resolver: zodResolver(docCompaniesSchema),
    defaultValues: {
      tipo: "",
      archivo: null,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const [tiposArchivo, setTiposArchivo] = useState([]);

  useEffect(() => {
    const loadTiposArchivo = async () => {
      try {
        const tipos = await fetchTiposArchivo();
        setTiposArchivo(tipos);
      } catch (error) {
        setTiposArchivo([]);
      }
    };
    loadTiposArchivo();
  }, []);

  const onSubmit = async (data) => {
    if (onSubmitProp) {
        console.log("Submitting data:", data);
      await onSubmitProp(data);
      form.reset({
        tipo: "",
        archivo: null,
      });
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } else {
      
      reset();
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    }
  };

  return (
    <Form {...form}>
      <form
        className={`${className}`}
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <FormField
          name="tipo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccione una opción</FormLabel>
              <FormControl>
                <select
                  className="block w-full mt-1 border rounded-xl p-2"
                  {...field}
                >
                  <option value="">Seleccione una opción</option>
                  {tiposArchivo.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.tipo_archivo}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="archivo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel>Cargar archivo PDF</FormLabel>
              <FormControl>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="block w-full mt-1 bg-zinc-200 p-2 rounded-xl"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      field.onChange(file);
                      setFileName(file ? file.name : "");
                    }}
                  />
                  {fileName && (
                    <span className="block mt-2 text-blue-600 font-semibold">
                      {fileName}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {"Subir documento"}
        </Button>
      </form>
    </Form>
  );
};

export default DocCompanies;
