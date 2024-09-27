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
 
  const createMsgDeleteAccount = (first_name) => 
    `<p>Hola ${first_name},</p>
     <p>Lamentamos informarte que tu cuenta ha sido eliminada debido a inactividad prolongada.</p>
     <p>Si tienes alguna pregunta, por favor contacta con nuestro soporte.</p>`;
  
     const createMsgDeleteProduct = (first_name, productName) => 
      `<p>Hola ${first_name},</p>
       <p>Te informamos que tu producto <strong>${productName}</strong> ha sido eliminado del sistema.</p>`;
      

  export const sendMail = async (user, service, token = null,productName = null) => {
    try {
      const { first_name, email } = user;
  
      let msg = '';
      let subj = '';
  
      switch (service) {
        case 'register':
          msg = createMsgRegister(first_name);
          subj = 'Bienvenido/a';
          break;
        case 'resetPass':
          if (!token) {
            throw new Error('Token es requerido para el restablecimiento de contraseña');
          }
          msg = createMsgReset(first_name, token);
          subj = 'Restablecimiento de contraseña';
          break;
        case 'deleteAccount':
          msg = createMsgDeleteAccount(first_name);
          subj = 'Cuenta eliminada por inactividad';
          break;
        case 'deleteProduct':
          if (!productName) {
            throw new Error('El nombre del producto es requerido para la notificación');
          }
          msg = createMsgDeleteProduct(first_name, productName);
          subj = 'Producto eliminado';
          break;
        default:
          throw new Error('Servicio de correo no reconocido');
      }
  
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