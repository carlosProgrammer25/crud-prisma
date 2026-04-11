//Servidor HTTP com rotas Express / Rodar API para Postman
import "dotenv/config";
//framework de produção com node, facilita a criacao do servidor http
//npm install --save-dev @types/express => ts nao entende typagem do express
import express from "express";
import { getClientes, getCliente, UpdateCliente, addCliente, deleteCliente } from "./repositories/clientesRepository.ts"

const PORT = 3000;
//instancia o servidor 
const app = express();
//ler o corpo da requisicao em formato json e transformar em obj js
app.use(express.json());


// ROTAS
// Buscar todos os dados da tabela
app.get('/clientes', async (req, res) => {
    try {
        //consulta
        const resultado = await getClientes();
        return res.status(200).json(resultado)
    }   
    catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'erro na busca' });
    };
});


// Buscar somente um registro com base no id
app.get("/cliente/:id", async (req, res) => {

    try {
        const id = Number(req.params.id);
        //isNaN converte o valor antes de verificar, se id for igual a NaN, entra no if
        //number.isNan() nao converte, verifica exatamente o valor
        if(Number.isNaN(id)){
            return res.status(400).json({ error: "ID inválido" });
        };

        const resultado = await getCliente(id);

        //se nao encontrar registro retorna null
        if (resultado === null) {
            return res.status(404).json({ erro: `Cliente com id ${req.params.id} nao encontrado` })
        };

        return res.status(200).json(resultado);
    }
    catch (error) {
        console.error(error);
        //falha servidor => banco
        res.status(500).json({ message: 'erro ao buscar registro pelo id' })
    };
});


// Atualizar dados na tabela
app.put('/atualizar/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const dadosAtualizar = {
            Nome: req.body.nome,
            Idade: req.body.idade,
            UF: req.body.uf
        };

        if(Number.isNaN(id)){
            return res.status(400).json({ error: "ID inválido" });
        };

        const consulta = await UpdateCliente(id, dadosAtualizar);

        //se nao atualizar campo no registro
        if (!consulta) {
            return res.status(404).json({ erro: 'nao atualizado' })
        };

        //se consulta for sucesso
        return res.status(200).json(consulta);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno" });
    };
});


// Criar registro na tabela
app.post('/criar', async (req, res) => {
    try {
        const consulta = await addCliente({
            Nome: req.body.nome,
            Idade: req.body.idade,
            //no schema uf esta configurado até 2 caracters max
            UF: req.body.uf
        });

        //sucesso ao criar novo registro
        return res.status(201).json(consulta)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ erro: "erro servidor" });
    };
});


//Deletar registro
app.delete('/deletar/:id', async (req, res) => {
    try {
        //pega valor da url que esta em string e transforma em numero
        const id = Number(req.params.id);

        //se id nao for um numero => is not a number
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const resultado = await deleteCliente(id);

        //se nao existir id na tabela, delet retorna null
        if (resultado === null) {
            return res.status(404).json({ erro: "Cliente não encontrado" })
        };

        return res.status(200).json({
            mensagem: "sucesso",
            data: resultado
        });
    }
    catch (error) {
        //se ocorrer erro com o banco retorna para o cath
        console.error(error);
        return res.status(500).json({ error: 'nao rodou' })
    };
});

//se nenhuma rota for chamada
app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});


//inicia o servidor/liga
app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}`);
});
