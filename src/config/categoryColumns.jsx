import React, { useRef, useState, useEffect } from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { fetchProductDetails } from "@src/lib/api/apiIndex"; // Importar la función para llamar a la API

const categoryColumns = (onCategorySelect) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
          position: window.innerWidth <= 768 ? "fixed" : "absolute", // Fijar posición solo en móvil
          top: window.innerWidth <= 768 ? "50%" : "auto", // Centrar verticalmente en móvil
          left: window.innerWidth <= 768 ? "50%" : "auto", // Centrar horizontalmente en móvil
          transform: window.innerWidth <= 768 ? "translate(-50%, -50%)" : "none", // Ajustar para centrar completamente en móvil
          backgroundColor: "white", // Fondo blanco para visibilidad
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra para destacar
          zIndex: 1000, // Asegurar que esté encima de otros elementos
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Resetear
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: "#800080", marginRight: 5 }} /> // Cambiar color a morado y agregar margen
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        <>
          <SearchOutlined style={{ color: "#800080", marginRight: 5 }} /> {/* Ícono al inicio */}
          {text}
        </>
      ),
  });

  return [
    {
      title: "Código Arancelario",
      dataIndex: "codigo_arancelario",
      key: "codigo_arancelario",
      width: window.innerWidth <= 768 ? 40 : undefined, // Ancho fijo solo en móvil
      ...getColumnSearchProps("codigo_arancelario"),
      render: (text, record) => (
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => onCategorySelect(record)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Descripción de la mercancia",
      dataIndex: "nombre",
      key: "nombre",
      width: window.innerWidth <= 768 ? 50 : undefined, // Ancho fijo solo en móvil
      fixed: window.innerWidth <= 768 ? "left" : undefined, // Fijar solo en móvil
      ...getColumnSearchProps("nombre"),
      render: (text, record) => (
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => onCategorySelect(record)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Capítulo",
      dataIndex: "descripcion",
      key: "descripcion",
      width: window.innerWidth <= 768 ? 300 : undefined, // Ancho fijo solo en móvil
      ellipsis: window.innerWidth <= 768, // Aplicar ellipsis solo en móvil
      ...getColumnSearchProps("descripcion"),
      render: (text, record) => (
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => onCategorySelect(record)}
        >
          {text}
        </span>
      ),
    },
  ];
};

export default categoryColumns;
