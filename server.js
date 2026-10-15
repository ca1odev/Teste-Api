import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Simulação de uma lista de alunos
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

// Função para validar os dados do aluno
function validarAluno({ nome, email, idade, curso }) {
    if (
        typeof nome !== "string" || !nome.trim() ||
        typeof curso !== "string" || !curso.trim()
    ) {
        return "Nome e curso são obrigatórios.";
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return "E-mail inválido.";
    }

    if (
        typeof idade !== "number" ||
        !Number.isInteger(idade) ||
        idade < 0 ||
        idade > 100
    ) {
        return "A idade deve ser um número inteiro entre 0 e 100.";
    }

    return null;
}

// GET - Listar todos os alunos
app.get("/alunos", (req, res) => {
    res.status(200).json(alunos);
});

// GET - Buscar aluno por ID
app.get("/alunos/:id", (req, res) => {
    const id = Number(req.params.id);
    const aluno = alunos.find(a => a.id === id);

    if (!Number.isInteger(id) || !aluno) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado."
        });
    }

    res.status(200).json(aluno);
});

// GET - Buscar alunos por curso
app.get("/alunos/curso/:curso", (req, res) => {
    const curso = req.params.curso.toLowerCase();

    const resultado = alunos.filter(aluno =>
        aluno.curso.toLowerCase().includes(curso)
    );

    res.status(200).json(resultado);
});

// POST - Cadastrar aluno
app.post("/alunos", (req, res) => {
    const erro = validarAluno(req.body);

    if (erro) {
        return res.status(400).json({ mensagem: erro });
    }

    const novoId = alunos.length
        ? Math.max(...alunos.map(a => a.id)) + 1
        : 1;

    const novoAluno = {
        id: novoId,
        nome: req.body.nome.trim(),
        email: req.body.email,
        idade: req.body.idade,
        curso: req.body.curso.trim()
    };

    alunos.push(novoAluno);

    res.status(201).json(novoAluno);
});

// PUT - Atualizar todos os dados do aluno
app.put("/alunos/:id", (req, res) => {
    const id = Number(req.params.id);
    const indice = alunos.findIndex(a => a.id === id);

    if (!Number.isInteger(id) || indice === -1) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado."
        });
    }

    const erro = validarAluno(req.body);

    if (erro) {
        return res.status(400).json({ mensagem: erro });
    }

    const alunoAtualizado = {
        id,
        nome: req.body.nome.trim(),
        email: req.body.email,
        idade: req.body.idade,
        curso: req.body.curso.trim()
    };

    alunos[indice] = alunoAtualizado;

    res.status(200).json({
        mensagem: "Aluno atualizado com sucesso.",
        aluno: alunoAtualizado
    });
});

// PATCH - Atualizar somente a idade
app.patch("/alunos/:id", (req, res) => {
    const id = Number(req.params.id);
    const aluno = alunos.find(a => a.id === id);

    if (!Number.isInteger(id) || !aluno) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado."
        });
    }

    const campos = Object.keys(req.body);

    if (
        campos.length !== 1 ||
        campos[0] !== "idade" ||
        typeof req.body.idade !== "number" ||
        !Number.isInteger(req.body.idade) ||
        req.body.idade < 0 ||
        req.body.idade > 100
    ) {
        return res.status(400).json({
            mensagem: "Envie somente a idade, como número inteiro entre 0 e 100."
        });
    }

    aluno.idade = req.body.idade;

    res.status(200).json({
        mensagem: "Idade atualizada com sucesso.",
        aluno
    });
});

// DELETE - Excluir aluno
app.delete("/alunos/:id", (req, res) => {
    const id = Number(req.params.id);
    const indice = alunos.findIndex(a => a.id === id);

    if (!Number.isInteger(id) || indice === -1) {
        return res.status(404).json({
            mensagem: "Aluno não encontrado."
        });
    }

    const alunoRemovido = alunos.splice(indice, 1)[0];

    res.status(200).json({
        mensagem: "Aluno excluído com sucesso.",
        aluno: alunoRemovido
    });
});

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});