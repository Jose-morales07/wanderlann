"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

import {
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaSignOutAlt,
  FaArrowRight,
} from "react-icons/fa";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  const router = useRouter();

  useEffect(() => {
    cargarUsuario();
  }, []);

  async function cargarUsuario() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("id_auth", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setUsuario(data);

    const { data: favoritosDB, error: errorFavoritos } = await supabase
      .from("Lugares_Favoritos")
      .select("*")
      .eq("id_usuario", data.id_usuario);

    if (errorFavoritos) {
      console.error(errorFavoritos);
      return;
    }

    const { data: sitiosDB, error: errorSitios } = await supabase
      .from("Sitios_Intereses")
      .select("*");

    if (errorSitios) {
      console.error(errorSitios);
      return;
    }

    const favoritosCompletos = favoritosDB.map((favorito) => ({
      ...favorito,
      sitio: sitiosDB.find(
        (s) => Number(s.id_sitio) === Number(favorito.id_sitio)
      ),
    }));

    setFavoritos(favoritosCompletos);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* NAVBAR */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl shadow-lg">
              🌎
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-blue-700">
                Wanderlann
              </h1>

              <p className="text-gray-500">
                Descubre Panamá
              </p>
            </div>

          </div>

          {usuario && (
            <div className="flex items-center gap-6">

              <div className="text-right">

                <p className="font-bold text-slate-800">
                  {usuario.Nombre}
                </p>

                <p className="text-sm text-gray-500">
                  {usuario.correo}
                </p>

              </div>

              <button
                onClick={cerrarSesion}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl shadow transition-all duration-300"
              >
                <FaSignOutAlt />
                Salir
              </button>

            </div>
          )}

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* BIENVENIDA */}

        {usuario && (

          <section className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 rounded-3xl shadow-2xl overflow-hidden mb-10">

            <div className="p-10 flex flex-col lg:flex-row justify-between gap-10">

              <div>

                <p className="uppercase tracking-[4px] text-blue-100 text-sm">
                  Bienvenido de nuevo
                </p>

                <h2 className="text-5xl font-black text-white mt-3">
                  ¡Hola, {usuario.Nombre}! 👋
                </h2>

                <p className="mt-5 text-blue-100 text-lg">
                  {usuario.correo}
                </p>

                <p className="mt-6 max-w-2xl text-blue-50 leading-8">
                  Explora playas paradisíacas, montañas, pueblos y los
                  lugares más increíbles de Panamá. Guarda todos tus
                  destinos favoritos y vuelve cuando quieras.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-5 min-w-[280px]">

                <div className="bg-white/20 backdrop-blur rounded-3xl p-6 text-center">

                  <p className="text-5xl font-black">
                    {favoritos.length}
                  </p>

                  <p className="mt-2 text-blue-100">
                    Favoritos
                  </p>

                </div>

                <div className="bg-white/20 backdrop-blur rounded-3xl p-6 text-center">

                  <p className="text-5xl">
                    🇵🇦
                  </p>

                  <p className="mt-2 text-blue-100">
                    Panamá
                  </p>

                </div>

              </div>

            </div>

          </section>

        )}

        {/* FAVORITOS */}

        <section className="bg-white rounded-3xl shadow-xl p-8">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <FaHeart className="text-red-500" />
              Mis Lugares Favoritos
            </h2>

            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
              {favoritos.length} lugares
            </span>

          </div>

          {favoritos.length === 0 ? (

            <div className="text-center py-20">

              <p className="text-6xl mb-4">
                ❤️
              </p>

              <h3 className="text-2xl font-bold text-slate-700">
                Todavía no tienes favoritos
              </h3>

              <p className="text-gray-500 mt-2">
                Explora lugares y comienza a guardar tus destinos favoritos.
              </p>

            </div>

          ) : (
            favoritos.map((favorito) => (
              <div
                key={favorito.id_favorito}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">

                  {/* Imagen temporal */}
                  <div className="lg:w-72 w-full h-52 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-7xl text-white shadow-lg">
                    🏝️
                  </div>

                  {/* Información */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>

                      <div className="flex items-center justify-between flex-wrap gap-3">

                        <h3 className="text-3xl font-bold text-slate-800">
                          {favorito.sitio?.Nombre}
                        </h3>

                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                          {favorito.sitio?.Categoria}
                        </span>

                      </div>

                      <div className="flex items-center gap-2 text-gray-500 mt-4">

                        <FaMapMarkerAlt className="text-red-500" />

                        <span>
                          {favorito.sitio?.Ubicacion}
                        </span>

                      </div>

                      <p className="text-gray-600 leading-7 mt-6">
                        {favorito.sitio?.Descripcion}
                      </p>

                    </div>

                    <div className="flex justify-end mt-8">

                      <button
                        onClick={() =>
                          router.push(`/sitio/${favorito.id_sitio}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105"
                      >
                        Ver detalles
                        <FaArrowRight />
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            ))
          )}

        </section>

      </div>

    </main>
  );
}