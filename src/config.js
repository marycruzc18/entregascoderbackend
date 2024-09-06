import dotenv from 'dotenv';

dotenv.config();

const config = {
    
        MONGO_URL:process.env.MONGO_URL,
        MONGO_URL_LOCAL:process.env.MONGO_URL_LOCAL,
    
        SECRET_KEY:process.env.SECRET_KEY,

        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,  
        CALLBACK_URL: process.env.CALLBACK_URL,
    
        EMAIL_ADMIN:process.env.EMAIL_ADMIN,
        PASS_ADMIN:process.env.PASS_ADMIN,
    
        JWT_SECRET:process.env.JWT_SECRET,

        EMAIL: process.env.EMAIL,
        PASSWORD: process.env.PASSWORD,

        USER_EMAIL:process.env.USER_EMAIL,
        PASS_USER:process.env.PASS_USER,
    
}

export default config;