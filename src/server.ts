import { app } from "./app";

const PORT = process.env.SERVER_PORT || 8888;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
