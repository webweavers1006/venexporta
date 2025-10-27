import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@src/components/ui/card";
import EventFormFields from "@src/components/molecules/EventFormFields";
import { message } from "antd";
import { postEvent } from "@src/lib/api/apiIndex";
import appStore from "@src/store/appStore";
import { useNavigate } from "react-router-dom";

import PropTypes from 'prop-types';

const EventForm = ({ onSubmit }) => {
  const idCompany = appStore.getState().idCompany;
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        img_evento: data.img_evento || null,
      };

      // Crear el evento usando la función del API
      await postEvent(payload);

      message.success("Evento creado satisfactoriamente");
      navigate("/event/manager");
    } catch (error) {
      console.error("Error al registrar el evento:", error);
      message.error("Error al registrar el evento");
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Registro de Evento</CardTitle>
        <CardDescription>Complete los campos requeridos</CardDescription>
      </CardHeader>
      <CardContent>
        <EventFormFields submit={onSubmit || handleSubmit} />
      </CardContent>
    </Card>
  );
};

export default EventForm;

EventForm.propTypes = {
  onSubmit: PropTypes.func,
};
