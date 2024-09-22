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

export function sendMailCompra(email, ticket) {
    const mailCompra = {
        from: config.mailing.USER,
        to: email,
        subject: '¡Gracias por comprar con nosotros!',
        html: `
            <h1>¡Gracias por tu compra, ${ticket.purchaser.first_name} ${ticket.purchaser.last_name}!</h1>
                <p>Hemos recibido tu pedido con el código <strong>${ticket.code}</strong> el día ${new Date(ticket.purchase_datetime).toLocaleString()}.</p>
                
                <h2>Detalles del Comprador:</h2>
                <ul>
                    <li><strong>Nombre:</strong> ${ticket.purchaser.first_name} ${ticket.purchaser.last_name}</li>
                    <li><strong>Email:</strong> ${ticket.purchaser.email}</li>
                    <li><strong>Edad:</strong> ${ticket.purchaser.age}</li>
                    <li><strong>Rol:</strong> ${ticket.purchaser.role}</li>
                </ul>


            <h2>Productos Comprados:</h2>
            <table border="1" cellpadding="10" cellspacing="0">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Código</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${ticket.products.map(product => `
                        <tr>
                            <td>${product.title}</td>
                            <td>${product.description}</td>
                            <td>${product.code}</td>
                            <td>${product.price}</td>
                            <td>${product.quantity}</td>
                            <td>${product.price * product.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2>Total a Pagar: $${ticket.totalAmount}</h2>
            
            <p>¡Gracias por confiar en nosotros! Esperamos verte pronto.</p>
        `
    };
    transporter.sendMail(mailCompra, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
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