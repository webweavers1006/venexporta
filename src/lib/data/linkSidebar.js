import {
  House,
  CalendarPlus,
  LifeBuoy,
  Building2,
  Calendar,
  Building,
  CalendarHeart,
  PieChart,
  BriefcaseBusiness,
  Album,
  FolderKanban,
  Archive,
  ArchiveRestore,
  ArrowLeftRight,
  CalendarCheck,
  ClipboardPlus,
  TrendingUpDown,
  QrCode,
  CalendarCog
} from "lucide-react";
import logo from '@assets/logo/isologoC.png';
import avatar from "@assets/logo/avatar.png";
import useAuthStore from '@src/store/authStore';
import { useStore } from 'zustand';
import appStore from '@store/appStore';

// This is sample data.
export const data = () => {
  const { tipoUsuario } = useAuthStore();
  const idCompany = useStore(appStore, state => state.idCompany);
  const idPais = useStore(appStore, state => state.idPais);

  const navMain = [
    {
      title: "Inicio",
      url: "/",
      icon: House,
      color: "#2D044A",
      isActive: true,
    },
    tipoUsuario === 'ADMINISTRADOR' && {
      title: "Reportes",
      icon: BriefcaseBusiness,
      badge : "Nuevo",
      color: "#2D044A",
      isActive: true,
      items: [
        {
          title: "Reportes de Empresas",
          url: "reports",
          icon: ClipboardPlus,
          color: "#2D044A",
          isActive: true,
        },
        {
          title: "Dinamico Masivo Empresas",
          url: "reports/dinamics",
          icon: TrendingUpDown,
          color: "#2D044A",
          isActive: true,
          
        },
        {
          title: "Reportes de Citas",
          url: "Reports/Appointments",
          icon: CalendarHeart,
          color: "#2D044A",
          isActive: true,
        }
      ],
    },
    tipoUsuario === 'ADMINISTRADOR' && {
      title: "Administrador",
      icon: BriefcaseBusiness,
      color: "#2D044A",
      isActive: true,
      items: [
        {
          title: "Panel de control",
          url: "dashboard",
          icon: PieChart,
          color: "#2D044A",
          isActive: true,
        },
        {
          title: "Solicitudes de Eventos",
          url: "requests/event",
          icon: CalendarCheck,
          color: "#2D044A",
          isActive: true,
        },
        {
          title: "Gestor de eventos",
          url: "event/manager",
          icon: CalendarCog,
          color: "#2D044A",
          isActive: true,
        },
        {
          title: "Empresas",
          url: "list/companies",
          icon: Building2,
          color: "#2D044A",
        },
        {
          title: "Citas por eventos",
          url: "schedules/event",
          icon: Calendar,
          color: "#2D044A",
        },
        {
          title: "QR Dinámico",
          url: "qr/dinamic",
          icon: QrCode,
          color: "#3f0d30",
        },
        /*
        {
          title: "Productos",
          url: "#",
          icon: Archive,
          color: "#2D044A",
        }, */
      ],
    },
    {
      title: "Eventos",
      icon: Calendar,
      color: "#2D044A",
      isActive: true,
      items: [
        {
          title: "Eventos Disponibles",
          url: "event/feed",
          icon: CalendarPlus,
          color: "#2D044A",
        },
        {
          title: "Mis Eventos",
          url: "myevent/feed",
          icon: CalendarHeart,
          color: "#2D044A",
        }
      ],
    },
    {
      title: "Rueda de Negocios",
      icon: BriefcaseBusiness,
      color: "#2D044A",
      isActive: true,
      items: [
        /* idPais !== null && idPais !== undefined && idPais !== 95 &&  */{
          title: "Empresas",
          url: "roundtable/companies",
          icon: Building2,
          color: "#2D044A",
        },
        /* idPais === 95 && */{
          title: "Reuniones Recibidas",
          url: "appointmentsReceived",
          icon: ArrowLeftRight,
          color: "#2D044A",
        },
        /* idPais !== null && idPais !== undefined && idPais !== 95 &&  */{
          title: "Reuniones Enviadas",
          url: "appointmentsSend",
          icon: ArrowLeftRight,
          color: "#2D044A",
        }
      ].filter(Boolean), // Filtra los valores falsos (null o undefined)
    },
    {
      title: "Mi Empresa",
      icon: Building,
      color:"#2D044A",
      items: [
        !idCompany && {
          title: "Crear Empresa",
          url: "company/register",
          color:"#2D044A"
        },
        idCompany && {
          title: "Empresa",
          url: "company",
          icon: Building,
          color:"#2D044A"
        },
        {
          title: "Contactos",
          url: "contacts",
          icon: Album,
          color:"#2D044A"
        },
        {
          title: "Actividades Economicas",
          url: "activities",
          icon: FolderKanban,
          color:"#2D044A"
        },
        /* idPais === 95 && */ {
          title: "Crear Producto",
          url: "product/register",
          icon: ArchiveRestore,
          color:"#2D044A"
        },
        /* idPais === 95 &&  */{
          title: "Productos",
          url: "products",
          icon: Archive,
          color:"#2D044A"
        },
      ].filter(Boolean), // Filtra los valores falsos (null o undefined)
    }
  ].filter(Boolean); // Filtra los valores falsos (null o undefined)

  return {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: avatar
    },
    teams: [
      {
        name: "Venexporta",
        logo: logo, // URL de la imagen PNG
        plan: "Activo",
      }
    ],
    navMain,
    navSecondary: [
      {
        title: "Quienes Somos",
        url: "https://venexporta.com/",
        icon: LifeBuoy,
      },
    ]
  };
};

export default data;