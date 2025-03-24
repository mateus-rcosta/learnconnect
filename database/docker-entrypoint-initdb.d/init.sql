-- Extensão necessária para gerar UUID automaticamente
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criação da tabela "usuarios" com UUID gerado automaticamente
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    apelido VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    bio TEXT,
    mfa BOOLEAN DEFAULT FALSE,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    data_criacao TIMESTAMP NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT now(),
    data_deletado TIMESTAMP -- Substitui a coluna 'deletado' por 'data_deletado'
);

-- Criação da tabela "materiais"
CREATE TABLE IF NOT EXISTS materiais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    flag VARCHAR(50) NOT NULL DEFAULT 'analise',
    thumbnail_url VARCHAR(255),
    data_aprovacao DATE,
    data_criacao TIMESTAMP NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT now(),
    usuarioId UUID NOT NULL,
    data_deletado TIMESTAMP, -- Substitui a coluna 'deletado' por 'data_deletado'
    CONSTRAINT fk_usuario_materiais FOREIGN KEY (usuarioId)
      REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Criação da tabela "comentarios"
CREATE TABLE IF NOT EXISTS comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conteudo TEXT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT now(),
    usuarioId UUID,
    materialId UUID,
    data_deletado TIMESTAMP, -- Substitui a coluna 'deletado' por 'data_deletado'
    CONSTRAINT fk_usuario_comentarios FOREIGN KEY (usuarioId)
      REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_material_comentarios FOREIGN KEY (materialId)
      REFERENCES materiais(id) ON DELETE CASCADE
);

-- Criação da tabela "likes"
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuarioId UUID NOT NULL,
    materiaisId UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (materiaisId) REFERENCES materiais(id) ON DELETE CASCADE,
    UNIQUE (usuarioId, materiaisId) 
);

-- Criação da tabela "anexos_material"
CREATE TABLE IF NOT EXISTS anexos_material (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    materiaisId UUID NOT NULL,
    arquivo_url VARCHAR(255) NOT NULL,
    arquivo_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (materiaisId) REFERENCES materiais(id) ON DELETE CASCADE
);