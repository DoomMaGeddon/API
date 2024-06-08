import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'guideinabyss@gmail.com',
        pass: '' // Aquí va la contraseña especificada en el Manual de despliegue de la memoria del proyecto
    }
});

export async function enviarCorreoEntrada(email: string) {
    const mailOptions = {
        from: 'guideinabyss@gmail.com',
        to: email,
        subject: 'Nueva Entrada',
        text: 'Se ha añadido una nueva entrada en la aplicación GuideInAbyss'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente a', email);
    } catch (error) {
        console.error('Error al enviar el correo electrónico: ', error);
    }
}

export async function enviarCorreoRegistro(email: string) {
    const mailOptions = {
        from: 'guideinabyss@gmail.com',
        to: email,
        subject: 'Gracias por registrarte',
        text: 'Bienvenido a Guide in Abyss. Espero que disfrutes mucho de la aplicación =)'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente a', email);
    } catch (error) {
        console.error('Error al enviar el correo electrónico: ', error);
    }
}
