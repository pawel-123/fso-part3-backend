const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

morgan.token('object', function getObject(req, res) {
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    }
})

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'));
app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>testing 123456</h1>');
});

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date.toUTCString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

const generateId = () => {
    const id = Math.floor(Math.random() * 100000);
    return id;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    if (persons.find(element => element.name === person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    if (persons.find(element => element.id === person.id)) {
        return response.status(400).json({
            error: 'this ID already exists, try to create person again'
        })
    }

    persons = persons.concat(person);

    response.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

