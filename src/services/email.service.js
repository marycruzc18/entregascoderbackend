import { createTransport } from "nodemailer";
import config from "../config.js";


const transporter = createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL,
      pass: config.PASSWORD,
    },
  });
  
  const createMsgRegister = (first_name) => 
    `<h1>Hola ${first_name}, ¡Bienvenido/a al Ecommerce!</h1>`;
  
  const createMsgReset = (first_name, token) => 
    `<p>¡Hola ${first_name}! Hacé click <a href="http://localhost:8080/reset-password?token=${token}">AQUÍ</a> para restablecer tu contraseña.</p>`;
 
  export const sendMail = async (user, service, token = null) => {
    try {
      const { first_name, email } = user;
  
      let msg = '';
      if (service === 'register') {
        msg = createMsgRegister(first_name);
      } else if (service === 'resetPass') {
        if (!token) {
          throw new Error('Token is required for password reset');
        }
        msg = createMsgReset(first_name, token);
      }
  
      const subj = service === 'register' ? 'Bienvenido/a' : 'Restablecimiento de contraseña';
  
      const gmailOptions = {
        from: config.EMAIL,
        to: email,
        subject: subj,
        html: msg,
      };
  
      const response = await transporter.sendMail(gmailOptions);
      if (token) return token;
      console.log('Email enviado', response);
    } catch (error) {
      throw new Error(error);
    }
  };