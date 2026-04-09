//  carrega o arquivo .env
import "dotenv/config"
//  Arquivo principal de acesso ao banco de dados
import { getClientes, getCliente, UpdateCliente, addCliente, deleteCliente, prisma} from "./repositories/clientesRepository.ts"

//  Prisma=> primeira função que acessar o banco cria a conexão, e todas as funções seguintes reutilizam essa mesma conexão
//  Com o pool, a conexão fica conectada até que a aplicação seja encerrada ou o timeout seja atingido


async function start() {
    //roda o codigo, se rodar ele vai pra finally, se der erro vai para catch
    try {
        // Consultar banco retorna varios registros
        const resultado = await getClientes();
        console.log(resultado);


        // Consultar banco, retorna 1 registro
        const resultado2 = await getCliente(1005);
        if(resultado2){
            console.log(resultado2.Nome);
        }
        else{
            console.log('Cliente não encontrado');
        }


        // Atualizar registros no banco
        const atualizando = await UpdateCliente(1028, {Nome: 'novo nom'});
        //TRATAMENTO DE RETORNO
        if(atualizando == null){
            console.log('registro nao encontrado')
        }else{
            console.log('FOI ATUALIZADO', atualizando)
        };


        // Criar nova registro no banco
        const inserir = await addCliente({
            Nome: 'novo registro',
            Idade: 99,
            UF: 'PR'
        });
        console.log('INSERIDO', inserir)


        // Retorna o registro que foi deletado
        const deletar = await deleteCliente(1028);
        // TRATAMENTO DE RETORNO
        if(deletar == null){
            console.log('JA foi deletado')
        }else{
            console.log('REGISTRO DELETADO', deletar)    
        };
        
    // TRATAMENTO DE ERRO
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}


start();