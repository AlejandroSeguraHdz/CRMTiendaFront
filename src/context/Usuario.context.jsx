// src/context/Usuario.context.jsx
import { createContext, useContext, useState } from "react";
import {
  createUsuarioRequest,
  deleteUsuarioRequest,
  getUsuarioRequest,
  getUsuariosRequest,
  updateUsuarioRequest,
} from "../api/Usuario";

const UsuarioContext = createContext();

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error("useUsuario must be used within a UsuarioProvider");
  }
  return context;
};

export function UsuarioProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const createUsuario = async (usuarioFormData) => {
    try {
      const res = await createUsuarioRequest(usuarioFormData);
      await getUsuarios();
      return res.data;
    } catch (error) {
      console.error("createUsuario error:", error);
      throw error;
    }
  };

  const getUsuarios = async () => {
    try {
      const res = await getUsuariosRequest();
      setUsuarios(res.data || []);
    } catch (error) {
      console.error("getUsuarios error:", error);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      const res = await deleteUsuarioRequest(id);
      if (res.status === 204 || res.status === 200) {
        setUsuarios((prev) => prev.filter((u) => u._id !== id));
      }
      return res;
    } catch (error) {
      console.error("deleteUsuario error:", error);
      throw error;
    }
  };

  const getOnlyOneUsuario = async (id) => {
    try {
      const res = await getUsuarioRequest(id);
      setUsuario(res.data);
      return res.data;
    } catch (error) {
      console.error("getOnlyOneUsuario error:", error);
      throw error;
    }
  };

  const updateUsuario = async (id, usuarioData) => {
    try {
      const res = await updateUsuarioRequest(id, usuarioData);
      if (res && res.data) {
        setUsuarios((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      } else {
        setUsuarios((prev) => prev.map((u) => (u._id === id ? { ...u, ...usuarioData } : u)));
      }
      return res.data;
    } catch (error) {
      console.error("updateUsuario error:", error);
      throw error;
    }
  };

  return (
    <UsuarioContext.Provider
      value={{
        usuarios,
        usuario,
        createUsuario,
        getUsuarios,
        deleteUsuario,
        getOnlyOneUsuario,
        updateUsuario,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
}
