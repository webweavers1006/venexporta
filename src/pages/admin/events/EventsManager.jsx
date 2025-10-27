import AtomsPanel from '@components/atoms/AtomsPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@src/components/ui/card";
import { useAssociatedCompaniesEvents } from './hooks/useAssociatedCompaniesEvents';
import { eventsColumns, mapEvents } from './columns/eventsColumns';
import { Button } from '@src/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import MoleculesTableShacdn from '@components/molecules/tables/MoleculesTableShacdn';

function EventsManagerTable() {
    const { carouselItems } = useAssociatedCompaniesEvents();
    console.log('Eventos cargados en tabla:', carouselItems);

    const rows = mapEvents(carouselItems);

    const handleEdit = (id) => {
        // Placeholder: el usuario definirá la acción exacta más adelante
         message.error('No esta permitido borrar este evento');
    };
    
    const handleDelete = async (id) => {
        // Usar modal de antd para confirmar eliminación
        Modal.confirm({
            title: 'Confirmación',
            content: '¿Seguro que quiere borrar este evento?',
            okText: 'Aceptar',
            cancelText: 'No',
            onOk: async () => {
                // Por el momento no se permite borrar: mostrar mensaje de error
                try {
                    // Simular intento de borrado o lógica futura
                    // await deleteEventByCompany(id);
                    message.error('No esta permitido borrar este evento');
                    // Si en el futuro se elimina correctamente, se podría recargar:
                    // loadEventsData();
                } catch (error) {
                    message.error('Error al salir del evento');
                }
            },
        });
    };

    // Las columnas con `cell` se definen en `eventsColumns` (usa key `url` y `nombre`)
    const tableColumns = eventsColumns;

    return (
        <>
            <AtomsPanel
                title={'Gestor de eventos'}
                subtitle={'Gestión de eventos'}
                aria-label="Panel de registro de eventos"
            />
            <Card className={'mt-4'}>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Lista de eventos</CardTitle>
                        <CardDescription>Cree, edite y elimine eventos</CardDescription>
                    </div>
                </CardHeader>
                {/* El botón de crear se pasa ahora como headerActions al componente de tabla */}
                <CardContent>
                    <div className="space-y-4">
                        <MoleculesTableShacdn
                            columns={tableColumns}
                            rows={rows}
                            headerActions={(
                                <Button asChild className="text-white float-end">
                                    <Link to="/event/create" aria-label="Crear evento" title="Crear evento">
                                        <Plus className="inline-block mr-2 w-4 h-4 align-text-bottom" />
                                        Crear evento
                                    </Link>
                                </Button>
                            )}
                            // renderActions permite personalizar las acciones por fila
                            renderActions={(row) => (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(row.id)}
                                        className="p-1 rounded hover:bg-gray-100"
                                        aria-label={`Editar ${row?.nombre || row.id}`}
                                        title="Editar"
                                    >
                                        <Pencil className="h-5 w-5 text-blue-600" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(row.id)}
                                        className="p-1 rounded hover:bg-gray-100"
                                        aria-label={`Eliminar ${row?.nombre || row.id}`}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-5 w-5 text-red-600" />
                                    </button>
                                </>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default EventsManagerTable;
