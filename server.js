import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())


//simulação de uma lista de alunos
const alunos = [
    {
        id: 1,
        nome: "Ana Souza",
        email: "ana@email.com",
        idade: 16,
        curso: "Desenvolvimento de Sistemas"
    },
    {
        id: 2,
        nome: "Lucas Martins",
        email: "lucas@email.com",
        idade: 17,
        curso: "Desenvolvimento de Sistemas"
    },
    {
        id: 3,
        nome: "Antonela Braga",
        email: "antonela@email.com",
        idade: 17,
        curso: "Multimídia"
    },
    {
        id: 4,
        nome: "Liz Macedo",
        email: "liz@email.com",
        idade: 16,
        curso: "Robótica"
    }
];

//get - buscar os recursosss
app.get("/alunos", (req, res) => {
    res.status(200).json(alunos)
})

//get por id do aluno
app.get("/alunos/:id", (req, res) => {
    const id = Number(req.params.id)

    const aluno = alunos.find((a) => a.id === id)

    if(!aluno){
        return res.status(404).json({
            mensagem: "Aluno não encontrado"
        })
    }
    res.status(200).json(aluno)
})

//get em curso
app.get("/alunos/curso/:curso", (req, res) => {
    const curso = req.params.curso.toLowerCase()

    const resultado = alunos.filter((aluno) => 
        aluno.curso.toLowerCase().includes(curso)
    )
    res.json(resultado)
})

//POST = cadastrar aluno
app.post("/alunos", (req, res) => {
    const {nome, email, idade, curso } = req.body

    //validando o email
    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ){
        return res.status(400).json({
            mensagem: "E-mail inválido"
        })
    }

    //validando a idade
    if(
        typeof idade !== "number" || idade < 0 || idade > 100) {
        return res.status(400).json({
            mensagem: "A idade precisa ser numérica, maior que 0 e menor que 100"
        })
    }

    //cadastra finalmente o aluno
    const novoAluno = {
        id: alunos.length + 1,
        nome: req.body.nome,
        email: req.body.email,
        idade: req.body.idade,
        curso: req.body.curso
    }

    alunos.push(novoAluno)
    res.status(201).json(novoAluno)

})


app.put('/alunos/:id', (req,res) => {
    const id = Number(req.params.id)
    const {nome, idade, email, curso} = req.body
    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado"
        });
    }

    if (nome === undefined || idade === undefined || email === undefined || curso === undefined){
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios"
        });
    }
    
    aluno.nome = nome;
    aluno.idade = idade;
    aluno.email = email;
    aluno.curso = curso;


return res.status(201).json(aluno);

});

app.patch('/alunos/:id', (req, res) => {
    const id = Number(req.params.id);

    const aluno = alunos.find(aluno => aluno.id === id);


    if (!aluno) {
        return res.status(404).json({
            mensagem: "aluno não encontrado"
        });
    }

    if (req.body.nome !== undefined) {
        aluno.nome = req.body.nome;
    }

    if (req.body.idade !== undefined) {
        aluno.idade = req.body.idade;
    }

    if (req.body.email !== undefined) {
        aluno.email = req.body.email;
    }

    if (req.body.curso !== undefined) {
        aluno.curso = req.body.curso;
    }

    return res.json(aluno);
});

app.delete('/alunos/:id', (req, res) => {
    const id = Number(req.params.id);

    const indice = alunos.findIndex(aluno => aluno.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "aluno não encontrado"
        });
    }

    const aluno = alunos[indice]

    alunos.splice(indice, 1)

    return res.json({
        mensagem: "Aluno excluído com sucesso!",
        aluno: aluno
    })
});




app.listen(3000, () => {
    console.log("Api rodando em http://localhost:3000")
})