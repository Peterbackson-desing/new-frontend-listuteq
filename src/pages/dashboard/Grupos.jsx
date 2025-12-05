import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Grupos() {
    const [grupos, setGrupos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [profesoresGrupo, setProfesoresGrupo] = useState([]);
    const [showProfesoresModal, setShowProfesoresModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAlumnosModal, setShowAlumnosModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [grupoActual, setGrupoActual] = useState({
        id: null,
        nombre: '',
        cuatrimestre: '',
        estado: true,
        alumnoIds: []
    });
    const [alumnosGrupo, setAlumnosGrupo] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

    const API_URL = 'http://localhost:8086/grupos';
    const USUARIOS_URL = 'http://localhost:8084/usuarios/all';

    useEffect(() => {
        cargarGrupos();
        cargarUsuarios();
        cargarProfesores();
    }, []);

    const cargarGrupos = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            setGrupos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar grupos:', error);
            alert('Error al cargar grupos');
        }
    };

    const cargarUsuarios = async () => {
        try {
            const response = await axios.get(USUARIOS_URL);
            const alumnos = response.data.filter(u => u.rol === 'Usuario' || u.rol === 'Alumno' || u.rol === 'ESTUDIANTE');
            setUsuarios(Array.isArray(alumnos) ? alumnos : []);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    const cargarProfesores = async () => {
        try {
            const response = await axios.get(`${API_URL}/profesores-disponibles`);
            setProfesores(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar profesores:', error);
        }
    };

    const verAlumnos = async (grupo) => {
        try {
            const response = await axios.get(`${API_URL}/${grupo.id}`);
            setGrupoSeleccionado(grupo);
            setAlumnosGrupo(response.data.alumnos || []);
            setShowAlumnosModal(true);
        } catch (error) {
            console.error('Error al cargar alumnos del grupo:', error);
            alert('Error al cargar alumnos');
        }
    };

    const cerrarAlumnosModal = () => {
        setShowAlumnosModal(false);
        setAlumnosGrupo([]);
        setGrupoSeleccionado(null);
    };

    const abrirModal = async (grupo = null) => {
        setShowModal(true);
    };

    const cerrarModal = () => {
    };

    // ================================
    // FUNCIONES PARA PROFESORES
    // ================================

    const verProfesores = async (grupo) => {
        try {
            const response = await axios.get(`${API_URL}/${grupo.id}/profesores`);
            setGrupoSeleccionado(grupo);
            setProfesoresGrupo(response.data || []);
            setShowProfesoresModal(true);
        } catch (error) {
            console.error('Error al cargar profesores del grupo:', error);
            alert('Error al cargar profesores');
        }
    };

    const cerrarProfesoresModal = () => {
        setShowProfesoresModal(false);
        setProfesoresGrupo([]);
        setGrupoSeleccionado(null);
    };

    const handleChange = (e) => {
    };

    const handleCheckboxChange = (usuarioId) => {

    };

    const guardarGrupo = async (e) => {
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Grupos</h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cuatrimestre</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {grupos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No hay grupos registrados</td>
                                </tr>
                            ) : (
                                grupos.map((grupo) => (
                                    <tr key={grupo.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                            {grupo.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            {grupo.cuatrimestre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {grupo.estado ? (
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
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => verAlumnos(grupo)}
                                                    className="text-green-600 hover:text-green-900 flex items-center gap-1 text-xs"
                                                    title="Ver alumnos"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Alumnos
                                                </button>
                                                <button
                                                    onClick={() => verProfesores(grupo)}
                                                    className="text-orange-600 hover:text-orange-900 flex items-center gap-1 text-xs"
                                                    title="Ver profesores"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                    </svg>
                                                    Profesores
                                                </button>
                                                //botones
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Ver Alumnos */}
            {showAlumnosModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
                            <h2 className="text-xl font-semibold text-white">
                                Alumnos del Grupo: {grupoSeleccionado?.nombre}
                            </h2>
                            <button onClick={cerrarAlumnosModal} className="text-white hover:text-gray-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4 text-sm text-gray-600">
                                <p><strong>Cuatrimestre:</strong> {grupoSeleccionado?.cuatrimestre}</p>
                                <p><strong>Total de alumnos:</strong> {alumnosGrupo.length}</p>
                            </div>

                            {alumnosGrupo.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="mt-2">No hay alumnos asignados a este grupo</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {alumnosGrupo.map((alumno, index) => (
                                                <tr key={alumno.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumno.correo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button onClick={cerrarAlumnosModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Ver Profesores */}
            {showProfesoresModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600">
                            <h2 className="text-xl font-semibold text-white">
                                Profesores del Grupo: {grupoSeleccionado?.nombre}
                            </h2>
                            <button onClick={cerrarProfesoresModal} className="text-white hover:text-gray-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4 text-sm text-gray-600">
                                <p><strong>Cuatrimestre:</strong> {grupoSeleccionado?.cuatrimestre}</p>
                                <p><strong>Total de profesores:</strong> {profesoresGrupo.length}</p>
                            </div>

                            {profesoresGrupo.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                    <p className="mt-2">No hay profesores asignados a este grupo</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Núm. Empleado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {profesoresGrupo.map((profesor, index) => (
                                                <tr key={profesor.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {profesor.numeroEmpleado}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {profesor.nombreCompleto}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profesor.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <button
                                                            onClick={() => removerProfesor(profesor.id)}
                                                            className="text-red-600 hover:text-red-900 text-xs"
                                                        >
                                                            Remover
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button onClick={cerrarProfesoresModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
