import dotenv from 'dotenv';
dotenv.config();

export default {
  mailing: {
    SERVICE: process.env.MAIL_SERVICE,
    HOST: process.env.MAIL_HOST,
    USER: process.env.MAIL_USERNAME, 
    PASSWORD: process.env.MAIL_PASSWORD,
  },
  mongo: {
    URL: process.env.MONGO_URL,
  },
  jwt: {
    COOKIE: process.env.JWT_COOKIE,
    SECRET: process.env.JWT_SECRET,
  },
};
