//  Carregando configuracoes do .env
import "dotenv/config";
/*
    =>MariaDB é um sistema de gerenciamento de banco de dados relacional
    =>PrismaMariaDb ele serve para substituir o driver nativo do Prisma por um driver JavaScript puro chamado mariadb
*/
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
//  O Prisma Client foi gerado a partir do schema.prisma por meio do comando generate, onde ele utiliza os models para gerar a conexão com o banco de dados.
import { PrismaClient } from "@prisma/client";


/*
    new PrismaMariaDb() é criado um client completo de acesso ao banco
    URL serve só pra conexão (host, usuário, senha, banco, etc.)

    A DATABASE_URL fornece os dados de conexão (host, usuário, senha, banco), e o Prisma Client usa essas informações para se conectar ao banco.
    A estrutura do client (métodos, models, etc.) vem do schema.prisma.
*/
const adapter = new PrismaMariaDb(`${process.env.DATABASE_URL}`);
//  O prisma possui a configuração de conexão com o banco de dados, enquanto o PrismaMariaDb fornece os dados de conexão por meio do adapter,
const prisma = new PrismaClient({ adapter });


// Buscar varios registros
export function getClientes() {
    return prisma.clientes.findMany();
};
// Buscar somente 1 registro
export function getCliente(id: number) {
    return prisma.clientes.findUnique({
        where: { ID: id }
    });
};


//  Atualizar
type atualizar = {
    Nome?: string;
    Idade?: number;
    UF?: string;
};
//  Se usar a tipagem criada pelo prisma, tera que obeceder os campos gerados pelo model
export async function UpdateCliente(id: number, novoDado: atualizar) {
    //consultando se existe o registro com o id
    const clienteExiste = await prisma.clientes.findUnique({
        where: { ID: id }
    });

    //PREVENÇÃO DE ERRO
    //se nao existir retorna null, nao quebra o codigo
    if (!clienteExiste) {
        return null;
    };

    //se existir
    return await prisma.clientes.update({
        where: { ID: id },
        data: novoDado
    });
};


// Criar novo registro
type Cliente = {
    Nome: string;
    Idade: number;
    UF: string;
};
export function addCliente(newCustomer: Cliente) {
    return prisma.clientes.create({
        data: newCustomer
    });
}


// Deletar registro
export async function deleteCliente(id: number) {
    //verificando se id existe
    const clienteExiste = await prisma.clientes.findUnique({
        where: { ID: id }
    })

    //PREVENÇÃO DE ERRO
    //se nao existir rretorna null, nao quebra o codigo
    if (!clienteExiste) {
        return null;
    };

    //se existir
    return await prisma.clientes.delete({
        where: { ID: id }
    });
};



// Se precisar fechar a conexao com banco de dados
export {prisma};

