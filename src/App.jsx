import { useState, useEffect } from "react"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API = `${API_BASE}/api`;

export default function App() {
  const [productos, setProductos]   = useState([])
  const [formulario, setFormulario] = useState({
    nombre: "", descripcion: "", precio: "",
    stock: "", categoria: "", origen: "", imagen_url: ""
  })
  const [editando, setEditando] = useState(null)
  const [error, setError]       = useState("")
  const [exito, setExito]       = useState("")

  const obtenerProductos = async () => {
    const res  = await fetch(`${API}/productos`)
    const data = await res.json()
    setProductos(data)
  }

  useEffect(() => {
    obtenerProductos()
  }, [])

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const limpiarFormulario = () => {
    setFormulario({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "", origen: "", imagen_url: "" })
    setEditando(null)
    setError("")
  }

  const guardar = async () => {
    if (!formulario.nombre || !formulario.precio || !formulario.stock ||
        !formulario.descripcion || !formulario.categoria || !formulario.origen) {
      setError("Todos los campos son obligatorios excepto la imagen")
      return
    }
    if (formulario.precio <= 0) { setError("El precio debe ser mayor a 0"); return }
    if (formulario.stock < 0)   { setError("El stock no puede ser negativo"); return }
    setError("")

    if (editando) {
      await fetch(`${API}/productos/${editando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario)
      })
      setExito("Producto actualizado correctamente")
    } else {
      await fetch(`${API}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario)
      })
      setExito("Producto agregado correctamente")
    }

    limpiarFormulario()
    obtenerProductos()
    setTimeout(() => setExito(""), 3000)
  }

  const editar = (producto) => {
    setEditando(producto.id)
    setFormulario({
      nombre:      producto.nombre,
      descripcion: producto.descripcion,
      precio:      producto.precio,
      stock:       producto.stock,
      categoria:   producto.categoria,
      origen:      producto.origen,
      imagen_url:  producto.imagen_url || ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return
    await fetch(`${API}/productos/${id}`, { method: "DELETE" })
    setExito("Producto eliminado")
    obtenerProductos()
    setTimeout(() => setExito(""), 3000)
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">G</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Panel de Productos Leonali</h1>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
          {productos.length} productos
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-3 gap-8">

        {/* Formulario */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              {editando ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              {editando ? "Modifica los datos del producto" : "Completa los datos para agregar"}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}

            {exito && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded-lg px-4 py-3 mb-4">
                {exito}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nombre</label>
                <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Ej: Zanahoria" className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Descripción</label>
                <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Describe el producto..." className={inputClass} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Precio</label>
                  <input name="precio" type="number" value={formulario.precio} onChange={handleChange} placeholder="0.00" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Stock</label>
                  <input name="stock" type="number" value={formulario.stock} onChange={handleChange} placeholder="0" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Categoría</label>
                <input name="categoria" value={formulario.categoria} onChange={handleChange} placeholder="Ej: Verduras" className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Origen</label>
                <input name="origen" value={formulario.origen} onChange={handleChange} placeholder="Ej: México" className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  URL Imagen <span className="text-gray-400">(opcional)</span>
                </label>
                <input name="imagen_url" value={formulario.imagen_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={guardar} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition">
                {editando ? "Actualizar" : "Agregar producto"}
              </button>
              {editando && (
                <button onClick={limpiarFormulario} className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg transition">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">Inventario</h2>
              <p className="text-xs text-gray-400">Lista de productos registrados</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Origen</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-gray-400 text-sm">No hay productos registrados</p>
                      <p className="text-gray-300 text-xs mt-1">Agrega tu primer producto desde el formulario</p>
                    </td>
                  </tr>
                ) : (
                  productos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{p.nombre}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-48">{p.descripcion}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.origen}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">${p.precio}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          p.stock > 10
                            ? "bg-green-50 text-green-700"
                            : p.stock > 0
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {p.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => editar(p)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-medium">
                            Editar
                          </button>
                          <button onClick={() => eliminar(p.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition font-medium">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
