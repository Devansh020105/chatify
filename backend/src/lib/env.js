import "dotenv/config";
export const ENV = {
    PORT: process.env.PORT || 3000,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV : process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    RESEND_API_KEY : process.env.RESEND_API_KEY,
    EMAIL_FROM : process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    ARCJET_KEY:process.env.ARCJET_KEY,
    ARCJET_ENV:process.env.ARCJET_ENV
};


// CLOUDINARY_CLOUD_NAME = dgslr0wjv;
// CLOUDINARY_API_KEY = 898643592621826;
// CLOUDINARY_API_SECRET = J4xHIHqv1BHIOd0OeDehnRrOg-A;
// ARCJET_KEY = ajkey_01k8djhywyf0dsktb31pb1vdnn
// ARCJET_ENV = development

// PORT = 3000
// MONGO_URI = mongodb+srv://dailyzest2020_db_user:6YnMzlT5l4FKzqBI@cluster0.fz8gukb.mongodb.net/chatify_db?retryWrites=true&w=majority&appName=Cluster0
// NODE_ENV = development

// JWT_SECRET= myjwtsecret

// RESEND_API_KEY = re_7XzXL3Vt_15fTEoyRsooch1977ZuQ198C

// EMAIL_FROM = "onboarding@resend.dev"
// EMAIL_FROM_NAME = "Devansh Sharma"

// CLIENT_URL = http://localhost:5173