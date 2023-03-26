const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');
const router = require('./routes/endPoints');

app.use(express.json());
app.use(cors());
app.use('/users', router);

const PORT = process.env.PORT || 8000;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on the ${PORT}`);
    });
});
