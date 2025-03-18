import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/ormconfig"; // ou "./data-source", conforme sua organização
import usuarioRoutes from "./routes/Usuario.routes";
import authRoutes from "./routes/Auth.routes";
import bcrypt from "bcrypt";
import { Role, Usuario } from "./entity/Usuario";

const app = express();

// Configuração do CORS (ajuste as opções conforme necessário)
app.use(cors());
app.options("*", cors());

// Middleware para converter o body das requisições em JSON
app.use(express.json());

// Rotas da aplicação
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);

// Defina a porta do servidor
const PORT = process.env.PORT || 3000;

// Inicializando a conexão com o banco e iniciando o servidor
AppDataSource.initialize()
    .then(async () => {
        console.log("Banco de dados conectado!");
        await seedAdminUser();
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => console.error("Erro ao conectar ao banco de dados:", error));

async function seedAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Altere para uma senha segura!

    const userRepository = AppDataSource.getRepository(Usuario);
    const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

    if (!existingAdmin) {
        const adminUser = userRepository.create({
            email: adminEmail,
            nome: "Administrador",
            apelido: "admin1",
            senha: bcrypt.hashSync(adminPassword, 8),
            role: Role.ADMIN,
        });
        await userRepository.save(adminUser);
        console.log("Usuário admin padrão criado.");
    } else {
        console.log("Usuário admin já existe.");
    }
}