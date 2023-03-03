const User = require('../models/user_model')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let err = ''
let success = ''

module.exports = {

    render_main: (req,res)=>{
        // Renderiza a página principal
        res.render('index',{err: '', success: '', token: ''})
    },

    register: async (req,res)=>{

        // Verifica se o usuário não deixou nenhum dos campos de casastro vazios***
        let not_vazio = !req.body.user || !req.body.password || !req.body.repeat_password
        // ************************************************************************

        // Verifica se as senhas são iguais****************************************
        let senhas_diferentes = req.body.password != req.body.repeat_password
        // ************************************************************************




        // Verifico se há algum erro, mudando ele de acordo com a opção, pois estava dando erro de: error [err_http_headers_sent]: cannot set headers after they are sent to the client******************************************
        if (not_vazio){
            err = 'Usuário ou senha vazios'
        }else if (senhas_diferentes){
            err = 'Senhas não são iguais'
        }
        // **************************************************************************
        


        // Agora vou dar render com o erro correto, porém tive que colocar o "res" dentro de um if*************************************************
        if (not_vazio || senhas_diferentes){ 
            res.render('index',{err, success: '', token: ''})
        }
        // ****************************************************************************************


        // Aqui eu podia ser mais resumido no código, mas foi assim que ficou, verifico se já existe um usuário com o mesmo nome no Banco de Dados
        let allLogin = req.body.user

        let allUsers = await User.find({usuario: allLogin})
        // **************************************************************************


        // Neste caso faço verificações em etapas para não dar conflitos com outros "res", utilizei o array devolvido para checar o tamanho dele, len > 1 = já existe
        if (allUsers.length == 0){

            // Caso um dos campos não sejam vazios e as senhas forem diferente faça:
            if (!not_vazio && !senhas_diferentes){
                let crypt_password = bcrypt.hashSync(req.body.password, 10)
                // Precisei eliminar a repetição de senha para salvar o usuário no banco de dados
                let person = {usuario: req.body.user, senha: crypt_password}
                let user = new User(person)
                try{
                    let doc = await user.save({})
                    res.render('index', {err: '',success: 'Usuário cadastrado com sucesso', token: ''})
                }catch(err){
                    res.send(err)
                }
                // **************************************************************************
            }
            // **************************************************************************

        }else{
            // Tive que colocar mais uma camada para impedir que 2 respostas fossem enviados
            if (!senhas_diferentes && !not_vazio){
                res.render('index', {err: 'Usuário já existe',success: '', token: ''})
            }
            // **************************************************************************
        }    

        // **************************************************************************

    },

    login: async (req,res)=>{

        // Peguei o usuário e a senha digitados no body********
        let user_login = req.body.user
        let user_password = req.body.password

        // ******************************************************

        // Criei variáveis bolleanas para colocar nas condicionais: verifica se o usuario ou a senha estão vazios**
        let both_user_or_password_empty = !user_login || !user_password
        // *************************************************************************************************************

        let user = req.body
        
        let doc = await User.find({usuario: user.user})

        let bool_crypt = false

        // Verifica se o doc retornou algum usuário, se tiver algum usuário irá retornar True**
        let bool_doc_lenght = doc.length !== 0 
        // ************************************************************************************

        // Se encontrou então verifique a senha ****
        if (bool_doc_lenght){
            let Senha = doc[0].senha
            bool_crypt = bcrypt.compareSync(user.password, Senha)
        }
        // ******************************************

        // Vejo se a senha do usuário está correta e se os campos estão preenchidos**
        if (bool_crypt && !both_user_or_password_empty){
            // Pego o secredo no arq .env e dps crio o token a partir do usuario do _id, enviandp o token pelo header da requisição, podendo verifica-lo posteriormente
            const secret = process.env.SECRET
            const token = jwt.sign({id: doc[0]._id, usuario: doc[0].usuario}, secret)

            res.header('authorization-token', token)
            // **********************************************************************************
            res.render('index', {err: '', success: 'Usuário logado', token: token})
        // ***************************************************************************

        // Caso não retorne nada e os campos estão preenchidos só sobrou a opção de usuário ou senha incorretos**
        }else if(!both_user_or_password_empty){
            res.render('index', {err: 'Usuário ou senha incorretos', success:'', token: ''})
        }
        // ******************************************************************************************


        // Se um dos campos estiverem vazios irei responder com um erro para o usuário**
        if (both_user_or_password_empty){

            res.render('index', {err: 'Usuário ou senha vazios', success: '', token: ''})
        
        }
        // ******************************************************************************
    },

    see_all: (req,res)=>{
        res.render('all_users')
    }

}



