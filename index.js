const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`Request received at: ${currentTime}`);
    console.log(`${req.method} ${req.url}`);
    next();
});

let users = [];

const formatResponse = (message, extraData = {}) => {
    return {
        message,
        time: new Date().toISOString(),
        ...extraData
    };
};

app.get('/', (req, res) => {
    res.json(formatResponse("Server Running"));
});

app.get('/users', (req, res) => {
    res.json(formatResponse("Users retrieved successfully", { data: users }));
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json(formatResponse("Name and email are required"));
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json(formatResponse("Email already exists"));
    }

    const newUser = { 
        id: Date.now().toString(), 
        name, 
        email 
    };
    users.push(newUser);

    res.status(201).json(formatResponse("User added successfully", { data: newUser }));
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json(formatResponse("User not found"));
    }

    users.splice(index, 1);
    res.json(formatResponse("User deleted successfully"));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(formatResponse("All fields required"));
    }

    if (email === "admin@gmail.com" && password === "1234") {
        res.json(formatResponse("Login Success"));
    } else {
        res.status(401).json(formatResponse("Invalid Credentials"));
    }
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json(formatResponse("User not found"));
    }

    res.json(formatResponse("User retrieved successfully", { data: user }));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
