import config from '../config/config.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: config.mailing.SERVICE,
    auth: {
        user: config.mailing.USER,
        pass: config.mailing.PASSWORD
    }
});

export function sendPasswordResetEmail(email, token) {
    const resetLink = `http://localhost:8080/api/sessions/reset-password?token=${token}`;
    const mailOptions = {
        from: config.mailing.USER,
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

export function sendCompraAprobada(email, ticket) {
    const mailOptions = {
        from: config.mailing.USER,
        to: email,
        subject: '🛡️ ¡Compra Aprobada! Gracias por confiar en nosotros',
        html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #E7E2D1; padding: 20px; color: #5B1F0F;">
            <div style="max-width: 700px; margin: auto; background-color: #C2B7A0; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px;">
            <div style="text-align: center; margin-top: 30px;">
                <img src="https://res.cloudinary.com/dsvo0wjue/image/upload/v1744145650/banner2_gm9jzu.jpg" alt="Banner" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px;" />
            </div>
                <h1 style="text-align: center; color: #5B1F0F;">¡${ticket.purchaser.first_name}, gracias por tu compra!</h1>
              
                <p>Hemos recibido y aprobado tu pedido con el código <strong>${ticket.code}</strong> el <strong>${new Date(ticket.purchase_datetime).toLocaleString()}</strong>.</p>

                <h2>🧍 Tus datos:</h2>
                <ul>
                    <li><strong>Nombre:</strong> ${ticket.purchaser.first_name} ${ticket.purchaser.last_name}</li>
                    <li><strong>Email:</strong> ${ticket.purchaser.email}</li>
                </ul>

                <h2>🛒 Productos:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #8B5B29; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Producto</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Precio</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Cantidad</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ticket.products.map(p => `
                            <tr style="background-color: #E7E2D1;">
                                <td style="padding: 10px; border: 1px solid #ddd;">${p.title}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${p.price}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${p.quantity}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${p.price * p.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h2 style="text-align: right;">💰 Total: $${ticket.totalAmount.toFixed(2)}</h2>

                <p style="margin-top: 20px;">⚔️ Gracias por confiar en nuestro comercio medieval. ¡Esperamos volver a verte pronto!</p>
                <div style="text-align: center; margin-top: 30px;">
                    <img src="https://res.cloudinary.com/dsvo0wjue/image/upload/v1744145651/logoMail_bkhkmd.png" alt="Logo medieval" width="150" />
                </div>
            </div>
        </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo de compra aprobada:', error);
        } else {
            console.log('Correo de compra aprobada enviado:', info.response);
        }
    });
}


export function sendCompraPendiente(email, ticket) {
    const mailOptions = {
        from: config.mailing.USER,
        to: email,
        subject: '🛡️ ¡Falta un poco más! Tu pago esta pendiente',
        html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #E7E2D1; padding: 20px; color: #5B1F0F;">
            <div style="max-width: 700px; margin: auto; background-color: #C2B7A0; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px;">
            <div style="text-align: center; margin-top: 30px;">
                <img src="https://res.cloudinary.com/dsvo0wjue/image/upload/v1744145650/banner2_gm9jzu.jpg" alt="Banner" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px;" />
            </div>
                <h1 style="text-align: center; color: #5B1F0F;">¡${ticket.purchaser.first_name}, gracias por tu compra!</h1>
              
                <p>Hemos recibido tu pedido co el coodigo <strong>${ticket.code}, el pago esta pendiente.</strong></p>
                
                <p><strong>Cuando se termine de procesar el pago recibiras una notificación por correo</strong></p>

                <h2>🧍 Tus datos:</h2>
                <ul>
                    <li><strong>Nombre:</strong> ${ticket.purchaser.first_name} ${ticket.purchaser.last_name}</li>
                    <li><strong>Email:</strong> ${ticket.purchaser.email}</li>
                </ul>

                <h2>🛒 Productos:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #8B5B29; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Producto</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Precio</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Cantidad</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ticket.products.map(p => `
                            <tr style="background-color: #E7E2D1;">
                                <td style="padding: 10px; border: 1px solid #ddd;">${p.title}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${p.price}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${p.quantity}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${p.price * p.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h2 style="text-align: right;">💰 Total: $${ticket.totalAmount.toFixed(2)}</h2>

                <p style="margin-top: 20px;">⚔️ Gracias por confiar en nuestro comercio medieval.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <img src="https://res.cloudinary.com/dsvo0wjue/image/upload/v1744145651/logoMail_bkhkmd.png" alt="Logo medieval" width="150" />
                </div>
            </div>
        </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo de compra aprobada:', error);
        } else {
            console.log('Correo de compra pendiente enviado:', info.response);
        }
    });
}

export function sendCompraCancelada(email, ticket) {
    const mailOptions = {
        from: config.mailing.USER,
        to: email,
        subject: '🛡️ Tu pago fue rechazado ❌',
        html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #E7E2D1; padding: 20px; color: #5B1F0F;">
            <div style="max-width: 700px; margin: auto; background-color: #C2B7A0; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px;">
            <div style="text-align: center; margin-top: 30px;">
                <img src="https://res.cloudinary.com/dsvo0wjue/image/upload/v1744145650/banner2_gm9jzu.jpg" alt="Banner" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px;" />
            </div>
                <h1 style="text-align: center; color: #5B1F0F;">${ticket.purchaser.first_name}, tu pago fue rechazado ❌, ${ticket.purchaser.first_name}!</h1>
              
                <p>Tuvimos un problema al recibir el pago del pedido <strong>${ticket.code}</strong></p>
                <p>Por favor intenta comprar nuevamente</p>

                <p>Te dejamos a continuación de todas maneras los datos de tu pedido:</p>

                <h2>🧍 Tus datos:</h2>
                <ul>
                    <li><strong>Nombre:</strong> ${ticket.purchaser.first_name} ${ticket.purchaser.last_name}</li>
                    <li><strong>Email:</strong> ${ticket.purchaser.email}</li>
                </ul>

                <h2>🛒 Productos:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #8B5B29; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Producto</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Precio</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Cantidad</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ticket.products.map(p => `
                            <tr style="background-color: #E7E2D1;">
                                <td style="padding: 10px; border: 1px solid #ddd;">${p.title}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${p.price}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${p.quantity}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${p.price * p.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h2 style="text-align: right;">💰 Total: $${ticket.totalAmount.toFixed(2)}</h2>

                <p style="margin-top: 20px;">⚔️ Gracias por confiar en nuestro comercio medieval.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <img src="https://res.cloudinary.com/dsvo0wjue/image/upload/v1744145651/logoMail_bkhkmd.png" alt="Logo medieval" width="150" />
                </div>
            </div>
        </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo de compra aprobada:', error);
        } else {
            console.log('Correo de compra cancelada enviado:', info.response);
        }
    });
}

export async function sendEmail(emailDetails) {
    const mailOptions = {
        from: config.mailing.USER,
        to: emailDetails.to,
        subject: emailDetails.subject,
        text: emailDetails.text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return info;
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error;
    }
}