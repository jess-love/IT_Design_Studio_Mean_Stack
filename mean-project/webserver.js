const app = require('./serverside/app');
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
