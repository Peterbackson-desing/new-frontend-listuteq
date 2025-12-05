import { useState, useEffect } from 'react';
import {
    Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, CalendarRange
} from 'lucide-react';
import HorarioTabla from '../../components/HorarioTabla';

export default function UserPage() {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
    const [tabActiva, setTabActiva] = useState('asistencias');

    useEffect(() => {
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const usuarioGuardado = localStorage.getItem('usuario');
            if (!token || !usuarioGuardado) {
                setError('No hay sesión activa. Por favor inicia sesión.');
                setLoading(false);
                return;
            }
            const dataUsuario = JSON.parse(usuarioGuardado);
            setUsuario(dataUsuario);
            const responseAsistencias = await fetch(
                `http://localhost:8088/asistencias/alumno/${dataUsuario.matricula}/detalle`
            );
            if (!responseAsistencias.ok) throw new Error('Error al cargar asistencias');
            const dataAsistencias = await responseAsistencias.json();
            setAsistencias(dataAsistencias);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getTipoAsistenciaInfo = (tipo) => {
        switch (tipo) {
            case 'PRESENTE':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <CheckCircle className="w-5 h-5" />,
                    label: 'Presente'
                };
            case 'RETRASO':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <AlertCircle className="w-5 h-5" />,
                    label: 'Retardo'
                };
            case 'FALTA':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: <XCircle className="w-5 h-5" />,
                    label: 'Falta'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <AlertCircle className="w-5 h-5" />,
                    label: tipo
                };
        }
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const agruparPorMateria = () => {
        const materias = {};
        asistencias.forEach(asistencia => {
            if (!materias[asistencia.nombreMateria]) {
                materias[asistencia.nombreMateria] = {
                    nombre: asistencia.nombreMateria,
                    asistencias: [],
                    presentes: 0,
                    retardos: 0,
                    faltas: 0
                };
            }
            materias[asistencia.nombreMateria].asistencias.push(asistencia);
            if (asistencia.tipoAsistencia === 'PRESENTE') materias[asistencia.nombreMateria].presentes++;
            else if (asistencia.tipoAsistencia === 'RETRASO') materias[asistencia.nombreMateria].retardos++;
            else if (asistencia.tipoAsistencia === 'FALTA') materias[asistencia.nombreMateria].faltas++;
        });
        return Object.values(materias);
    };

    const calcularEstadisticas = () => {
        const asistenciasFiltradas = materiaSeleccionada
            ? asistencias.filter(a => a.nombreMateria === materiaSeleccionada)
            : asistencias;

        const total = asistenciasFiltradas.length;
        const presentes = asistenciasFiltradas.filter(a => a.tipoAsistencia === 'PRESENTE').length;
        const retardos = asistenciasFiltradas.filter(a => a.tipoAsistencia === 'RETRASO').length;
        const faltas = asistenciasFiltradas.filter(a => a.tipoAsistencia === 'FALTA').length;
        const porcentajeAsistencia = total > 0 ? ((presentes + retardos) / total * 100).toFixed(1) : 0;

        return { total, presentes, retardos, faltas, porcentajeAsistencia };
    };

    const materias = agruparPorMateria();
    const stats = calcularEstadisticas();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Cargando asistencias...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={cargarDatosUsuario}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Reintentar
                            </button>
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                            >
                                Ir a Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleCerrarSesion = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Panel de Estudiante
                            </h1>
                            {usuario && (
                                <p className="text-gray-600 mt-1 text-sm md:text-base">
                                    {usuario.nombre} {usuario.apellidoPaterno} {usuario.apellidoMaterno} - {usuario.matricula}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                            {materiaSeleccionada && tabActiva === 'asistencias' && (
                                <button
                                    onClick={() => setMateriaSeleccionada(null)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm"
                                >
                                    ← Volver
                                </button>
                            )}
                            <button
                                onClick={cargarDatosUsuario}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Actualizar
                            </button>

                            <button 
                            onClick={handleCerrarSesion}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="mt-6 border-b border-gray-200">
                        <nav className="flex flex-wrap -mb-px gap-2" aria-label="Tabs">
                            <button
                                onClick={() => setTabActiva('asistencias')}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                                    tabActiva === 'asistencias'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <CheckCircle className="w-5 h-5" />
                                <span>Mis Asistencias</span>
                            </button>
                            <button
                                onClick={() => setTabActiva('horario')}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                                    tabActiva === 'horario'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <CalendarRange className="w-5 h-5" />
                                <span>Mi Horario</span>
                            </button>
                        </nav>
                    </div>
                </div>
                {/* Contenido de Tabs */}
                {tabActiva === 'asistencias' && (
                    <>
                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-xs md:text-sm">Total</p>
                                        <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
                                    </div>
                                    <Calendar className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-xs md:text-sm">Presentes</p>
                                        <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.presentes}</p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-xs md:text-sm">Retardos</p>
                                        <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.retardos}</p>
                                    </div>
                                    <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-xs md:text-sm">Faltas</p>
                                        <p className="text-2xl md:text-3xl font-bold text-red-600">{stats.faltas}</p>
                                    </div>
                                    <XCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                                </div>
                            </div>
                        </div>
                        {/* Barra de progreso */}
                        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                                Porcentaje de Asistencia {materiaSeleccionada && `- ${materiaSeleccionada}`}
                            </h2>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                            Asistencia
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-indigo-600">
                                            {stats.porcentajeAsistencia}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-indigo-200">
                                    <div
                                        style={{ width: `${stats.porcentajeAsistencia}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
                                    ></div>
                                </div>
                            </div>
                        </div>
                        {/* Lista de Materias o Asistencias */}
                        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                            {!materiaSeleccionada ? (
                                <>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Materias</h2>
                                    {materias.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg">No hay materias registradas</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {materias.map((materia, index) => {
                                                const total = materia.asistencias.length;
                                                const porcentaje = total > 0
                                                    ? (((materia.presentes + materia.retardos) / total) * 100).toFixed(1)
                                                    : 0;
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => setMateriaSeleccionada(materia.nombre)}
                                                        className="border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-500 hover:shadow-lg transition cursor-pointer"
                                                    >
                                                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                                                            {materia.nombre}
                                                        </h3>
                                                        <div className="space-y-2 mb-4">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Total clases:</span>
                                                                <span className="font-semibold">{total}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-green-600">Presentes:</span>
                                                                <span className="font-semibold text-green-600">{materia.presentes}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-yellow-600">Retardos:</span>
                                                                <span className="font-semibold text-yellow-600">{materia.retardos}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-red-600">Faltas:</span>
                                                                <span className="font-semibold text-red-600">{materia.faltas}</span>
                                                            </div>
                                                        </div>
                                                        <div className="pt-4 border-t border-gray-200">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs font-semibold text-gray-600">Asistencia</span>
                                                                <span className="text-xs font-semibold text-indigo-600">{porcentaje}%</span>
                                                            </div>
                                                            <div className="overflow-hidden h-2 rounded-full bg-gray-200">
                                                                <div
                                                                    style={{ width: `${porcentaje}%` }}
                                                                    className="h-full bg-indigo-600 transition-all duration-500"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 text-center">
                                                            <span className="text-sm text-indigo-600 font-medium">
                                                                Click para ver detalles →
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                                        Historial de Asistencias - {materiaSeleccionada}
                                    </h2>
                                    <div className="space-y-4">
                                        {asistencias
                                            .filter(a => a.nombreMateria === materiaSeleccionada)
                                            .map((asistencia) => {
                                                const tipoInfo = getTipoAsistenciaInfo(asistencia.tipoAsistencia);
                                                return (
                                                    <div
                                                        key={asistencia.id}
                                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${tipoInfo.color}`}>
                                                                        {tipoInfo.icon}
                                                                        {tipoInfo.label}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4" />
                                                                        <span>{formatearFecha(asistencia.fecha)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-4 h-4" />
                                                                        <span>
                                                                            Registrado: {formatearHora(asistencia.fecha)}
                                                                            {asistencia.horaInicio && ` (Clase: ${asistencia.horaInicio} - ${asistencia.horaFin})`}
                                                                        </span>
                                                                    </div>
                                                                    {asistencia.aula && (
                                                                        <div className="flex items-center gap-2">
                                                                            <MapPin className="w-4 h-4" />
                                                                            <span>Aula: {asistencia.aula}</span>
                                                                        </div>
                                                                    )}
                                                                    {asistencia.diaSemana && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="w-4 h-4" />
                                                                            <span className="capitalize">{asistencia.diaSemana}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>  
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
                {tabActiva === 'horario' && (
                    <div className="animate-fadeIn">
                        <HorarioTabla />
                    </div>
                )}
            </div>
        </div>
    );
}
