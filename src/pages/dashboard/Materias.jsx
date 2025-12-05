import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Materias() {
    const [materias, setMaterias] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [materiaActual, setMateriaActual] = useState({
        id: null,
        nombre: '',
        activo: true,
        programaId: '',
    });

    const API_URL = 'http://localhost:8083/materias';
    const PROGRAMAS_URL = 'http://localhost:8082/programas/all';

    useEffect(() => {
        cargarMaterias();
        cargarProgramas();
    }, []);

    const cargarMaterias = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            setMaterias(response.data);
        } catch (error) {
            console.error('Error al cargar materias:', error);
            alert('Error al cargar las materias');
        }
    };

    const cargarProgramas = async () => {
        try {
            const response = await axios.get(PROGRAMAS_URL);
            setProgramas(response.data);
        } catch (error) {
            console.error('Error al cargar programas:', error);
        }
    };

    const abrirModal = (materia = null) => {
    };

    const cerrarModal = () => {
    };

    const handleChange = (e) => {
    };

    const guardarMateria = async (e) => { };

    const deshabilitarMateria = async (id) => {
    };

    const habilitarMateria = async (id) => {
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Materias</h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Programa</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {materias.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay materias registradas</td>
                                </tr>
                            ) : (
                                materias.map((materia) => (
                                    <tr key={materia.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{materia.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{materia.nombrePrograma}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {materia.activo ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
