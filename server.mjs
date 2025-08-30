// server.mjs - Archivo completo y listo para usar

import * as LaunchDarkly from "@launchdarkly/node-server-sdk";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Inicializar cliente de LaunchDarkly con la clave del archivo .env
const client = LaunchDarkly.init(process.env.LD_SDK_KEY);

// Contexto del usuario para evaluación de flags
const context = {
  kind: "user",
  key: "user-key-123abcde",
  email: "test@example.com",
};

// Espera a que el SDK esté listo, y DENTRO de esa función,
// define las rutas y arranca el servidor.
client.once("ready", function () {
  console.log("SDK successfully initialized!");

  app.get("/", async (req, res) => {
    // Tracking de eventos (opcional)
    client.track(process.env.LD_EVENT_KEY, context);

    // Evaluación del feature flag
    client.variation(
      "feat-new-menu", // La clave de tu flag
      context,
      false, // Valor por defecto si hay un error
      function (err, showFeature) {
        if (err) {
          console.error("Error al evaluar el flag:", err);
          res.status(500).send("Error del servidor");
          return;
        }
        
        if (showFeature) {
          console.log("El flag es TRUE");
          res.send("<h1>🎉 Feature flag is ON - New menu active!</h1>");
        } else {
          console.log("El flag es FALSE");
          res.send("<h1>Feature flag is OFF - Original menu</h1>");
        }
      }
    );
  });

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
});