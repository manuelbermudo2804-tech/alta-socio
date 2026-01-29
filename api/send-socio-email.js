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
    // 📧 EMAIL AL CLUB (aviso interno)
    await resend.emails.send({
      from: "CD Bustarviejo <noreply@cdbustarviejo.com>",
      to: ["cdbustarviejo@outlook.es"],
      subject: "Nueva solicitud de socio",
      html: `
        <h3>Nueva solicitud de socio</h3>

        <p>Se han recibido los datos de una persona interesada en hacerse socia del club.</p>

        <ul>
          <li><strong>Nombre:</strong> ${nombre_completo}</li>
          <li><strong>DNI:</strong> ${dni}</li>
          <li><strong>Teléfono:</strong> ${telefono}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Dirección:</strong> ${direccion || "-"}</li>
          <li><strong>Municipio:</strong> ${municipio || "-"}</li>
          <li><strong>Fecha de nacimiento:</strong> ${fecha_nacimiento || "-"}</li>
        </ul>

        <p>
          El siguiente paso es completar el pago de la cuota anual a través de Stripe.
        </p>
      `,
    });

    // 📧 EMAIL AL SOCIO (bienvenida humana y honesta)
    await resend.emails.send({
      from: "CD Bustarviejo <noreply@cdbustarviejo.com>",
      to: [email],
      subject: "Gracias por querer formar parte del CD Bustarviejo",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <img src="https://alta-socio.vercel.app/escudo.png" width="120" alt="CD Bustarviejo" />

          <h2>¡Gracias por querer formar parte del CD Bustarviejo!</h2>

          <p>Hola <strong>${nombre_completo}</strong>,</p>

          <p>
            Hemos recibido correctamente tus datos para hacerte socio del
            <strong>Club Deportivo Bustarviejo</strong>.
          </p>

          <p>
            Estás a un solo paso de formar parte de esta gran familia que apuesta
            por el deporte local, el deporte femenino y un proyecto serio,
            transparente y con futuro.
          </p>

          <p>
            En cuanto completes el pago de la cuota anual,
            tu inscripción quedará finalizada y pasarás a formar parte oficialmente
            del club.
          </p>

          <p>
            Gracias de corazón por tu apoyo y por confiar en este proyecto.
            Todo lo que hacemos es por y para el club.
          </p>

          <p style="margin-top: 20px;">
            Un saludo,<br/>
            <strong>CD Bustarviejo</strong>
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error sending email" });
  }
}
