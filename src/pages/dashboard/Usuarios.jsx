import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState({
        id: null,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        matricula: '',
        correo: '',
        contrasena: '',
        rol: '',
        programaIds: []
    });

    const API_URL = 'http://localhost:8084/usuarios';
    const PROGRAMAS_URL = 'http://localhost:8082/programas/all';

    useEffect(() => {
        cargarUsuarios();
        cargarProgramas();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            setUsuarios(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar usuarios');
        }
    };

    const cargarProgramas = async () => {
        try {
            const response = await axios.get(PROGRAMAS_URL);
            console.log("Programas cargados:", response.data);
            setProgramas(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar programas:', error);
            alert('Error al cargar programas');
        }
    };

    const abrirModal = (usuario = null) => {

    };

    const cerrarModal = () => {

    };

    const handleChange = (e) => {

    };

    const handleCheckboxChange = (programaId) => {

    };

    const guardarUsuario = async (e) => {

    };

    return (
        <div className="p-6">
        </div>
    );
}
