// Importar módulos
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Configurar el motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware opcional para servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")));
// Middleware para parsear datos de formularios (POST)
app.use(express.urlencoded({ extended: true }));

// Control de timeout
app.use((req, res, next) => {
  const ms = 10000; //10 seg en milisegundos
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      console.warn("Tiempo de espera agotado");
      res.status(408).send("Tiempo de espera agotado");
    }
  }, ms);
  res.once("finish", () => clearTimeout(timer)); // se cierra el timer cuando transcurren el tiempo definido
  res.once("close", () => clearTimeout(timer)); // se cierra el timer si el usuario cierra la ventana antes de que finalice en timer
  next();
});

// ----------------------
// Formulario
// ----------------------
app.get("/form", (req, res) => {
  res.render("form", {
    nombre: "",
    edad: "",
    tipo: "",
    tamano: "",
    actividades: [],
    errores: [],
  });
});

app.post("/form", (req, res) => {
  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const tipo = req.body.tipo;
  const tamano = req.body.tamano;
  let actividades = req.body.actividades || [];
  if (!Array.isArray(actividades)) actividades = [actividades];

  // Control de errores
  // ==================

  let errores = [];
  // Validar que el nombre exista y tenga 2 caracteres o mas
  if (!nombre || nombre.trim().length < 2) {
    errores.push(
      "El nombre de tu mascota tiene que tener al menos 2 caracteres"
    );
  }

  // Validar que la edad no sea un valor negarivo
  if (!edad || edad < 0) {
    errores.push("Para registrar tu mascota primero tiene que haber nacido.");
  }

  // Validar que el tipo tenga un valor
  if (!tipo || !tipo.trim().length) {
    errores.push("Debes escoger un tipo de mascota para registrarla");
  }

  // Validar que el tamaño tenga un valor
  if (!tamano || !tamano.trim().length) {
    errores.push("Debes escoger el tamaño de tu mascota para registrarla");
  }

  // Si hay errores, se vuelve a renderizar el formulario con mensajes y los valores previos
  if (errores.length > 0) {
    return res.render("form", {
      nombre,
      edad,
      tipo,
      tamano,
      actividades,
      errores,
    });
  }

  // Si no hay errores, lanzo la página de respuestas
  res.render("resultado", {
    nombre,
    edad,
    tipo,
    tamano,
    actividades,
  });
});

// ----------------------
// Iniciar servidor
// ----------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
