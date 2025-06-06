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

CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT UNIQUE NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT now()
);

-- Criação da tabela "materiais"
CREATE TABLE IF NOT EXISTS materiais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    categoria_id UUID, 
    tags VARCHAR(200), 
    conteudo TEXT NOT NULL,
    flag VARCHAR(50) NOT NULL DEFAULT 'analise',
    thumbnail_url VARCHAR(255),
    data_aprovacao DATE,
    data_criacao TIMESTAMP NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT now(),
    data_deletado TIMESTAMP,
    usuario_id UUID NOT NULL,
    CONSTRAINT fk_usuario_materiais FOREIGN KEY (usuario_Id)
      REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_categoria_materiais FOREIGN KEY (categoria_id)
      REFERENCES categorias(id) ON DELETE CASCADE
);

-- Criação da tabela "comentarios"
CREATE TABLE IF NOT EXISTS comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conteudo TEXT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT now(),
    usuario_id UUID,
    material_id UUID,
    data_deletado TIMESTAMP, -- Substitui a coluna 'deletado' por 'data_deletado'
    CONSTRAINT fk_usuario_comentarios FOREIGN KEY (usuario_Id)
      REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_material_comentarios FOREIGN KEY (material_Id)
      REFERENCES materiais(id) ON DELETE CASCADE
);

-- Criação da tabela "likes"
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_Id UUID NOT NULL,
    material_Id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_Id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (material_Id) REFERENCES materiais(id) ON DELETE CASCADE,
    UNIQUE (usuario_Id, material_Id) 
);

-- Criação da tabela "anexos_material"
CREATE TABLE IF NOT EXISTS anexos_material (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_Id UUID NOT NULL,
    arquivo_url VARCHAR(255) NOT NULL,
    arquivo_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (material_Id) REFERENCES materiais(id) ON DELETE CASCADE
);

