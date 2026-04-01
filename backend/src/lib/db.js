import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database conectado! ${conn.connection.host}`);
    } catch (error){
        console.log("Erro ao conectar o database",error);
        process.exit(1);
        // sair com erro
    }
}