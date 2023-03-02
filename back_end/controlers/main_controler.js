const User = require('../models/user_model')

let err = ''
let success = ''

module.exports = {

    render_main: (req,res)=>{
        // Renderiza a página principal
        res.render('index',{err: '', success: ''})
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
            res.render('index',{err, success: ''})
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

                // Precisei eliminar a repetição de senha para salvar o usuário no banco de dados
                let person = {usuario: req.body.user, senha: req.body.password}
                let user = new User(person)
                try{
                    let doc = await user.save({})
                    res.render('index', {err: '',success: 'Usuário cadastrado com sucesso'})
                }catch(err){
                    res.send(err)
                }
                // **************************************************************************
            }
            // **************************************************************************

        }else{
            // Tive que colocar mais uma camada para impedir que 2 respostas fossem enviados
            if (!senhas_diferentes && !not_vazio){
                res.render('index', {err: 'Usuário já existe',success: ''})
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

        let user = {usuario: req.body.user, senha: req.body.password}

        let doc = await User.find(user)

        // Verifica se o doc retornou algum usuário, se tiver algum usuário irá retornar True**
        let bool_doc_lenght = doc.length !== 0 
        // ************************************************************************************


        // Vejo se retornei algum usuário e se os campos estão preenchidos**
        if (bool_doc_lenght && !both_user_or_password_empty){
            res.render('index', {err: '', success: 'Usuário logado'})
        // *****************************************************************

        // Caso não retorne nada e os campos estão preenchidos só sobrou a opção de usuário ou senha incorretos**
        }else if(!both_user_or_password_empty){

            res.render('index', {err: 'Usuário ou senha incorretos', success:''})
        }
        // ******************************************************************************************


        // Se um dos campos estiverem vazios irei responder com um erro para o usuário**
        if (both_user_or_password_empty){

            res.render('index', {err: 'Usuário ou senha vazios', success: ''})
        
        }
        // ******************************************************************************

    }

}



