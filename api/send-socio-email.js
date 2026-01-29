import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    nombre_completo,
    dni,
    telefono,
    email,
    direccion,
    municipio,
    fecha_nacimiento,
  } = req.body;

  try {
    await resend.emails.send({
      from: "CD Bustarviejo <noreply@cdbustarviejo.com>",
      to: ["cdbustarviejo@outlook.es"],
      subject: "Nuevo socio (datos recibidos)",
      html: `
        <h2>Nuevo socio</h2>
        <ul>
          <li><strong>Nombre:</strong> ${nombre_completo}</li>
          <li><strong>DNI:</strong> ${dni}</li>
          <li><strong>Teléfono:</strong> ${telefono}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Dirección:</strong> ${direccion || "-"}</li>
          <li><strong>Municipio:</strong> ${municipio || "-"}</li>
          <li><strong>Fecha nacimiento:</strong> ${fecha_nacimiento || "-"}</li>
        </ul>
      `,
    });

    await resend.emails.send({
      from: "CD Bustarviejo <noreply@cdbustarviejo.com>",
      to: [email],
      subject: "Gracias por hacerte socio del CD Bustarviejo",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <img src="https://alta-socio.vercel.app/escudo.png" width="120" />
          <h2>Gracias por hacerte socio</h2>
          <p>
            Hemos recibido correctamente tus datos.<br/>
            A continuación completarás el pago de la cuota anual.
          </p>
          <p>
            Gracias por apoyar el deporte local y el proyecto del CD Bustarviejo.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Email error" });
  }
}
