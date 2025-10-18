import exress from 'express';


const app = exress();

app.listen(5002, () => {
    console.log('Server is running on port 5002');
})