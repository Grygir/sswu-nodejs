import app from './src/app.js';
import serverConfig from './src/config/server.config.js';

const {PORT} = serverConfig;

app.listen(PORT, () => console.log(`Server is started http://localhost:${PORT}`));
