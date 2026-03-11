import { useState, useEffect } from "react"

const API = "http://localhost:8000/api"

export default function App() {
  const [productos, setProductos]   = useState([])
  const [formulario, setFormulario] = useState({
    nombre: "", descripcion: "", precio: "",
    stock: "", categoria: "", marca: "", imagen_url: ""
  })
  const [editando, setEditando]     = useState(null)
  const [error, setError]           = useState("")

  const obtenerProductos = async () => {
    const res  = await fetch(`${API}/productos`)
    const data = await res.json()
    setProductos(data)
  }

  // Cargar productos al iniciar
  useEffect(() => {
    obtenerProductos()
  }, [])

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const guardar = async () => {
    // Validar campos obligatorios
    if (!formulario.nombre || !formulario.precio || !formulario.stock) {
      setError("Nombre, precio y stock son obligatorios")
      return
    }
    setError("")

    if (editando) {
      // Actualizar
      await fetch(`${API}/productos/${editando}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formulario)
      })
      setEditando(null)
    } else {
      // Crear
      await fetch(`${API}/productos`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formulario)
      })
    }

    // Limpiar formulario y recargar
    setFormulario({
      nombre: "", descripcion: "", precio: "",
      stock: "", categoria: "", marca: "", imagen_url: ""
    })
    obtenerProductos()
  }

  const editar = (producto) => {
    setEditando(producto.id)
    setFormulario({
      nombre:      producto.nombre,
      descripcion: producto.descripcion,
      precio:      producto.precio,
      stock:       producto.stock,
      categoria:   producto.categoria,
      marca:       producto.marca,
      imagen_url:  producto.imagen_url || ""
    })
  }

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return
    await fetch(`${API}/productos/${id}`, { method: "DELETE" })
    obtenerProductos()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

    
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Panel de Productos
        </h1>

        {/* Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editando ? "Editar Producto" : "Agregar Producto"}
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input name="nombre"      value={formulario.nombre}      onChange={handleChange} placeholder="Nombre"      className="border rounded-lg p-2 col-span-2" />
            <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción" className="border rounded-lg p-2 col-span-2" rows={2} />
            <input name="precio"      value={formulario.precio}      onChange={handleChange} placeholder="Precio"      className="border rounded-lg p-2" type="number" />
            <input name="stock"       value={formulario.stock}       onChange={handleChange} placeholder="Stock"       className="border rounded-lg p-2" type="number" />
            <input name="categoria"   value={formulario.categoria}   onChange={handleChange} placeholder="Categoría"   className="border rounded-lg p-2" />
            <input name="marca"       value={formulario.marca}       onChange={handleChange} placeholder="Marca"       className="border rounded-lg p-2" />
            <input name="imagen_url"  value={formulario.imagen_url}  onChange={handleChange} placeholder="URL de imagen (opcional)" className="border rounded-lg p-2 col-span-2" />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={guardar}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editando ? "Actualizar" : "Agregar"}
            </button>
            {editando && (
              <button
                onClick={() => { setEditando(null); setFormulario({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "", marca: "", imagen_url: "" }) }}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Marca</th>
                <th className="p-3 text-left">Precio</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-400">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.nombre}</td>
                    <td className="p-3">{p.categoria}</td>
                    <td className="p-3">{p.marca}</td>
                    <td className="p-3">${p.precio}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => editar(p)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(p.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Eliminar
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
  )
}