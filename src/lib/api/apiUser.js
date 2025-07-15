import axios from 'axios';

import {API_BASE_URL} from '@lib/api/variables';

const api = axios.create({
    baseURL: 'https://api.imgbb.com',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

const apiKey = '398dda55e0b176a84ccf88f2310d8417'; // Reemplaza con tu clave API

async function uploadImage(file) {
    try {
        const base64Data = file;
        const formData = new FormData();
        formData.append('image', base64Data);

        const response = await api.post('/1/upload', formData, {
            params: {
                key: apiKey
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al subir la imagen:', error.response.data.error.message);
        return null;
    }
}

export async function uploadImages(files, id) {
    const uploadedUrls = [];
    for (const file of files) {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
            uploadedUrls.push(imageUrl);
            try {
                const values = {
                    img_empresa: imageUrl.data.display_url
                }
                const otherApiResponse = await axios.put(`${API_BASE_URL}/empresas/${id}`, { ...values });
                console.log('Success sending image URL to other API:');
            } catch (error) {
                console.error('Error sending image URL:', error.response.data.error.message);
            }
        }
    }
    return uploadedUrls;
}

export const postStepIdentification = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/user/EmpresaUserCreate`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        throw error;
    }
};

export const postStepSignature = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/empresas`, data);

        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        throw error;
    }
};

export const postStepContact = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contactos`, [data]);

        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        throw error;
    }
};

export const fetchEventos = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/eventos`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data.eventoss;
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        throw error;
    }
};

export const registerForEvent = async (id_evento, id_empresa) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/eventosByEmpresas`, { id_empresa, id_evento }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        throw error;
    }
};

export const fetchEventosByEmpresas = async (empresaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/eventosByEmpresas/${empresaId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data.eventosByEmpresass;
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        throw error;
    }
};

export const fetchContactData = async (idCompany) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/contactos/${idCompany}`);

        return response.data.contactoss;
    } catch (error) {
        console.error('Error fetching contact data:', error.response.data.error.message);
        throw error;
    }
};

export const fetchCompanyData = async (idUser) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/empresas/${idUser}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching company data:', error.response.data.error.message);
        throw error;
    }
};

export const fetchActivitiesData = async (idCompany) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/actividadesEconomicasByEmpresas/1/${idCompany}`);

        return response.data.actividadesEconomicasByEmpresass;
    } catch (error) {
        console.error('Error fetching activities data:', error.response.data.error.message);
        throw error;
    }
};

export const fetchAllActivities = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/actividades_economicas`);

        return response.data.actividadesEconomicass;
    } catch (error) {
        console.error('Error fetching all activities:', error.response.data.error.message);
        throw error;
    }
};

export const fetchSectors = async (selectedActivity) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sectores_productivos/${selectedActivity}`);

        return response.data.sectoresProductivoss;
    } catch (error) {
        console.error('Error fetching sectors:', error.response.data.error.message);
        throw error;
    }
};

export const postStepActivity = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/actividadesEconomicasByEmpresas`, data);
    return response.data;
};

export const fetchSubSectors = async (selectedSector) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sub_sectores_productivos/${selectedSector}`);

        return response.data.subSectoresProductivoss;
    } catch (error) {
        console.error('Error fetching subsectors:', error.response.data.error.message);
        throw error;
    }
};


export const loginUser = async (user, pass) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/user/authentication`, { user, pass });

        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        throw error;
    }
};

// Función para obtener información de la segunda API
export const fetchUserEstadis = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dash/cant_usuarios`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data from second API:', error.response.data.error.message);
        throw error;
    }
};

// Función para eliminar un contacto
export const deleteContact = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/contactos/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting contact:', error.response.data.error.message);
        throw error;
    }
};

// Función para eliminar un evento por empresa
export const deleteEventByCompany = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/eventosByEmpresas/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting event by company:', error.response.data.error.message);
        throw error;
    }
};

// Función para eliminar una actividad económica por empresa
export const deleteActivityByCompany = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/actividadesEconomicasByEmpresas/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting activity by company:', error.response.data.error.message);
        throw error;
    }
};

export const fetchPaises = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/paises`);
        return response.data.paisess;
    } catch (error) {
        console.error('Error fetching countries:', error.response.data.error.message);
        throw error;
    }
};

export const fetchRequisitos = async (id_user) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/requisitos/${id_user}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching requisitos:', error.response.data.error.message);
        throw error;
    }
};

export const updateCompanyData = async (data, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/empresas/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error("Error updating company data");
  }
};

export const fetchProductCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productos`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.productoss || [];
  } catch (error) {
    console.error('Error fetching product categories:', error.response.data.error.message);
    throw error;
  }
};

export const postCategory = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/productos`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar la categoría:', error.response.data.error.message);
    throw error;
  }
};

export const postProduct = async (data) => {
  try {
    // Si img tiene un valor, subir la imagen al servidor de imágenes
    if (data.img && data.img !== "no hay imagen cargada") {
      const uploadedImage = await uploadImage(data.img);
      if (uploadedImage && uploadedImage.data && uploadedImage.data.display_url) {
        data.img = uploadedImage.data.display_url; // Reemplazar img con la URL devuelta
      } else {
        throw new Error("Error al subir la imagen");
      }
    }

    const response = await axios.post(`${API_BASE_URL}/productosByEmpresas`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar el producto:', error.response.data.error.message);
    throw error;
  }
};

export const fetchProductsByCompany = async (idCompany) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productosByEmpresas/${idCompany}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.productosByEmpresass || [];
  } catch (error) {
    console.error('Error fetching products by company:', error.response.data.error.message);
    throw error;
  }
};

export const fetchProductDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productos/detalles`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.productosDetalless || [];
  } catch (error) {
    console.error("Error fetching product details:", error.response.data.error.message);
    throw error;
  }
};

export const fetchUnidadesMedida = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/unidades_medida`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.unidadesMedidas || [];
    } catch (error) {
        console.error('Error fetching unidades de medida:', error.response.data.error.message);
        throw error;
    }
};

export const fetchRangoTiempo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rango_tiempo`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.rangoTiempos || [];
    } catch (error) {
        console.error('Error fetching rango de tiempo:', error.response.data.error.message);
        throw error;
    }
};

export const deleteProductById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/productosByEmpresas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product by ID:', error.response.data.error.message);
    throw error;
  }
};

export const fetchEventDetails = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventos/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error.response.data.error.message);
    throw error;
  }
};

export const fetchCompaniesByEvent = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventosByEmpresas/rueda_negocios/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.eventosByEmpresasRNs || []; // Retornar las empresas asociadas al evento
  } catch (error) {
    console.error('Error fetching companies by event:', error.response.data.error.message);
    throw error;
  }
};
export const fetchCompaniesByEventAll = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventosByEmpresas/empresasXeventos/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.eventosByEmpresass || []; // Retornar las empresas asociadas al evento
  } catch (error) {
    console.error('Error fetching companies by event:', error.response.data.error.message);
    throw error;
  }
};

export const fetchCompaniestAll = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empresas`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.empresass || []; // Retornar las empresas asociadas al evento
  } catch (error) {
    console.error('Error fetching companies:', error.response.data.error.message);
    throw error;
  }
};

export const fetchCompanyEvents = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empresas/unique/${companyId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data || []; // Retornar los eventos asociados a la empresa
  } catch (error) {
    console.error('Error fetching company events:', error.response.data.error.message);
    throw error;
  }
};


export const fetchScheduleBlocks = async (eventId, companyId, tipo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bloques_horarios/${eventId}/${companyId}/${tipo}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const bloquesHorarios = response.data.bloquesHorarioss || [];

    // Agrupar bloques por fecha
    const groupedByDate = bloquesHorarios.reduce((acc, bloque) => {
      const date = bloque.fecha_hora.split(' ')[0]; // Obtener solo la fecha (YYYY-MM-DD)
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(bloque);
      return acc;
    }, {});

    return groupedByDate; // Retornar los bloques agrupados por fecha
  } catch (error) {
    console.error('Error fetching schedule blocks:', error.response.data.error.message);
    throw error;
  }
};

export const scheduleAppointment = async (id_evento, id_empresa_solicitante, id_empresa_receptora, fecha_solicitada) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/citas`, {
      id_evento,
      id_empresa_solicitante,
      id_empresa_receptora,
      fecha_solicitada,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error scheduling appointment:', error.response.data.error.message);
    throw error;
  }
};

export const fetchRequestedAppointments = async (idCompany, typeAppointment) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/citas/solicitadas/${typeAppointment}/${idCompany}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.citass || [];
    } catch (error) {
        console.error('Error fetching requested appointments:', error.response.data.error.message);
        throw error;
    }
};

export const updateAppointmentStatus = async (id, id_estatus , id_empresa_receptora, id_empresa_solicitante, fecha_solicitada ) => {
  console.log(id_estatus, id_empresa_solicitante, id_empresa_receptora);
  try {
    const response = await axios.put(`${API_BASE_URL}/citas/${id}`, { id_estatus, id_empresa_receptora, id_empresa_solicitante, fecha_solicitada  }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el estado de la cita:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/citas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting appointment:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const updateEventRequestStatus = async (id, id_estatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/eventosByEmpresas/${id}`, { id_estatus }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error actualizando el estatus de la solicitud de evento:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchActividadesEmpresariales = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/actividadesEmpresariales`);
    return response.data.actividadesEmpresarialess || [];
  } catch (error) {
    console.error('Error fetching actividades empresariales:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Crear documento en la API (POST a /documentos)
export const createDocumentoEmpresa = async ({ url_documento, id_empresa, id_tipo_archivo }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/documentos`, {
      url_documento,
      id_empresa,
      id_tipo_archivo
    });
    return response.data;
  } catch (error) {
    console.error('Error creando documento:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Obtener documentos de una empresa por ID
export const fetchDocumentosByEmpresa = async (id_empresa) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/documentos/${id_empresa}`);
    return response.data.documentoss || [];
  } catch (error) {
    console.error('Error fetching documentos by empresa:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Eliminar documento de empresa por ID
export const deleteDocumentoEmpresa = async (id_documento) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/documentos/${id_documento}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting documento empresa:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Obtener tipos de archivos
export const fetchTiposArchivo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tipo_archivo`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.tipoArchivos || [];
  } catch (error) {
    console.error('Error fetching tipos de archivo:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchCitasByEvento = async (id_evento) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/citas/lista/${id_evento}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.citass || [];
  } catch (error) {
    console.error('Error fetching citas by evento:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

