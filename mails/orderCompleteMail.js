const nodeMailer = require("nodemailer");

const orderCompleteMail = async (email, order) => {
    const config = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    };

    const transporter = nodeMailer.createTransport(config);

    let info = await transporter.sendMail({
        from: '"EFA SISTEMAS" <no-reply@efasistemas.com>', // sender address
        to: email, // list of receivers
        subject: "Su orden de compra ha sido aprobada!!", // Subject line
        // text: "Hello world?", // plain text body
        html: `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <style>
                                .icon {
                                    width: 50px;
                                    height: 50px;
                                    margin: 0 10px;
                                    fill: white;
                                }

                                .button {
                                    background-color: #091bad;
                                    font-family: Roboto, Helvetica;
                                    padding: 20px 60px;
                                    border-radius: 10px;
                                    font-size: 15px;
                                    font-weight: 700;
                                }

                                a {
                                    color: #fff !important;
                                    text-decoration: none;
                                }
                                div.center {
                                    margin-top: 20px;
                                    text-align: center;
                                }
                        </style>
                    </head>

                    <body>
                        <div>
                            <div style="margin: 0px auto; max-width: 600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                    <tbody>
                                        <tr style="background-color: #f7f7f7">
                                            <th style="padding: 20px">
                                                <img src="cid:logo" alt="" width="40%" />
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8%; font-family: Roboto, Helvetica, Arial, sans-serif">
                                                <strong>Gracias por su compra!</strong>
                                                <p>Su orden de compra N°<strong>${order.id.substr(0, 8).toUpperCase()}</strong> ha sido aprobada.</p>
                                                <p>
                                                    Le agradecemos siempre la confianza en nosotros y le invitamos a ingresar a nuestro sistema en la opcion ordenes para darle seguimiento al
                                                    status de la compra
                                                </p>

                                                <div style="margin-top: 50px">
                                                    <div class="center">
                                                        <a href="http://efasistema.com" target="_blank" style="color: #fff" class="button">IR A SITIO WEB</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td align="center" style="background-color: #091bad">
                                                <div style="padding: 30px">
                                                    <div>
                                                        <a href="https://www.facebook.com/EFACOMPUTACION" target="_blank"><img src="cid:fb" alt="" class="icon" /></a>
                                                        <a href="https://www.instagram.com/efasistemasycomputacion/?hl=es" target="_blank"><img src="cid:inst" alt="" class="icon" /></a>
                                                        <a href="https://api.whatsapp.com/message/ZSS6KIN7O5T6K1?autoload=1&app_absent=0" target="_blank"
                                                            ><img src="cid:ws" alt="" class="icon"
                                                        /></a>
                                                    </div>
                                                    <div style="margin-top: 10px; color: white; font-weight: 500; font-family: Roboto, Helvetica, Arial, sans-serif">
                                                        Todos los derechos reservados
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </body>
                </html>`, // html body
        attachments: [
            {
                filename: "fb.png",
                path: "./public/images/fb.png",
                cid: "fb",
            },
            // {
            // 	filename: "tw.png",
            // 	path: "./public/images/tw.png",
            // 	cid: "tw",
            // },
            {
                filename: "inst.png",
                path: "./public/images/inst.png",
                cid: "inst",
            },
            {
                filename: "ws.png",
                path: "./public/images/ws.png",
                cid: "ws",
            },
            {
                filename: "logo.png",
                path: "./public/images/logo.png",
                cid: "logo",
            },
        ],
    });
};

module.exports = orderCompleteMail;
