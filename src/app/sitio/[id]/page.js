"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { useParams } from "next/navigation";

export default function DetalleSitio() {
  const { id } = useParams();

  const [sitio, setSitio] = useState(null);

const [usuario, setUsuario] = useState(null);
const [esFavorito, setEsFavorito] = useState(false);

useEffect(() => {
  cargarSitio();
}, [id]);

async function cargarSitio() {
  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: usuarioBD } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("id_auth", user.id)
      .single();

    setUsuario(usuarioBD);

    if (usuarioBD) {
      const { data: favorito } = await supabase
        .from("Lugares_Favoritos")
        .select("*")
        .eq("id_usuario", usuarioBD.id_usuario)
        .eq("id_sitio", id)
        .maybeSingle();

      setEsFavorito(!!favorito);
    }
  }

  const { data, error } = await supabase
    .from("Sitios_Intereses")
    .select("*")
    .eq("id_sitio", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setSitio(data);
}

async function cambiarFavorito() {
  if (!usuario) return;

  if (esFavorito) {
    const { error } = await supabase
      .from("Lugares_Favoritos")
      .delete()
      .eq("id_usuario", usuario.id_usuario)
      .eq("id_sitio", sitio.id_sitio);

    if (!error) {
      setEsFavorito(false);
    }

    return;
  }

  const { error } = await supabase
    .from("Lugares_Favoritos")
    .insert({
      id_usuario: usuario.id_usuario,
      id_sitio: sitio.id_sitio,
    });

  if (!error) {
    setEsFavorito(true);
  }
}   

  if (!sitio) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">
          Cargando...
        </h1>
      </main>
    );
  }

return (
  <main className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-5xl mx-auto">

      {/* Botón volver */}
      <button
        onClick={() => history.back()}
        className="mb-6 bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Imagen */}
        <div className="h-80 bg-gray-300 flex items-center justify-center">

          {sitio.imagen_url ? (
            <img
              src={sitio.imagen_url}
              alt={sitio.Nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 text-2xl">
              📷 Imagen no disponible
            </span>
          )}

        </div>

        <div className="p-8">

          <h1 className="text-5xl font-bold text-blue-700 mb-8">
            {sitio.Nombre}
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <h3 className="font-bold text-lg">
                📍 Ubicación
              </h3>

              <p className="text-gray-700">
                {sitio.Ubicacion}
              </p>

            </div>

            <div>

              <h3 className="font-bold text-lg">
                🏷 Categoría
              </h3>

              <p className="text-gray-700">
                {sitio.Categoria}
              </p>

            </div>

          </div>

          <div className="mt-8">

            <h3 className="font-bold text-xl mb-3">
              📝 Descripción
            </h3>

            <p className="text-gray-700 leading-8">
              {sitio.Descripcion}
            </p>

<div className="grid md:grid-cols-2 gap-6 mt-8">

  <div className="bg-gray-100 rounded-xl p-4">
    <h3 className="font-bold text-lg">🚗 Tipo de acceso</h3>
    <p>{sitio.tipo_acceso}</p>
  </div>

  <div className="bg-gray-100 rounded-xl p-4">
    <h3 className="font-bold text-lg">💵 Costo de entrada</h3>
    <p>
      {sitio.costo_entrada == 0
        ? "Gratis"
        : `$${sitio.costo_entrada}`}
    </p>
  </div>

  <div className="bg-gray-100 rounded-xl p-4 md:col-span-2">
    <h3 className="font-bold text-lg">⚠ Restricciones</h3>

    <p>
      {sitio.restricciones || "Ninguna"}
    </p>
  </div>

</div>

          </div>

          <div className="mt-10 flex gap-4 flex-wrap">

<button
  onClick={cambiarFavorito}
  className={`px-6 py-3 rounded-xl text-white transition ${
    esFavorito
      ? "bg-red-600 hover:bg-red-700"
      : "bg-gray-700 hover:bg-gray-800"
  }`}
>
  {esFavorito ? "❤️ Quitar de Favoritos" : "🤍 Agregar a Favoritos"}
</button>

<a
  href={sitio.enlace_google_maps}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
>
  🗺 Abrir en Google Maps
</a>
          </div>

        </div>

      </div>

    </div>

  </main>
);}