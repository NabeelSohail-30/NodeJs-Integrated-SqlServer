const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

// GET all records
app.get('/records', (req, res) => {
    pool.request().query('SELECT * FROM TestEmployee', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching records from database');
        } else {
            res.send(result.recordset);
        }
    });
});

// GET a single record by ID
app.get('/records/:id', (req, res) => {
    const id = req.params.id;
    pool.request().input('id', id).query('SELECT * FROM TestEmployee WHERE id = @id', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching record from database');
        } else {
            if (result.recordset.length === 0) {
                res.status(404).send('Record not found');
            } else {
                res.send(result.recordset[0]);
            }
        }
    });
});

// POST a new record
app.post('/records', (req, res) => {
    const { Name, Age, Department, Income, Phone, Email, Address } = req.body;
    pool
        .request()
        .input('Name', Name)
        .input('Age', Age)
        .input('Department', Department)
        .input('Income', Income)
        .input('Phone', Phone)
        .input('Email', Email)
        .input('Address', Address)
        .query('INSERT INTO TestEmployee (Name, Age, Department, Income, Phone, Email, Address) VALUES (@Name, @Age, @Department, @Income, @Phone, @Email, @Address)',
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error adding record to database');
                } else {
                    res.send(result.recordset);
                }
            });
});

// PUT update an existing record by ID
app.put('/records/:id', (req, res) => {
    const { id } = req.params;
    const { Name, Age, Department, Income, Phone, Email, Address } = req.body;
    pool
        .request()
        .input('id', id)
        .input('Name', Name)
        .input('Age', Age)
        .input('Department', Department)
        .input('Income', Income)
        .input('Phone', Phone)
        .input('Email', Email)
        .input('Address', Address)
        .query('UPDATE TestEmployee SET Name = @Name, Age = @Age, Department = @Department, Income = @Income, Phone = @Phone, Email = @Email, Address = @Address WHERE id = @id',
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error updating record in database');
                } else {
                    res.send(result.recordset);
                }
            });
});

// DELETE a record by ID
app.delete('/records/:id', (req, res) => {
    const id = req.params.id;
    pool.request().input('id', id).query('DELETE FROM TestEmployee WHERE id = @id', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error deleting record from database');
        } else {
            if (result.rowsAffected.length === 0) {
                res.status(404).send('Record not found');
            } else {
                res.send(result.rowsAffected[0]);
            }
        }
    });
});
