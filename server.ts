
const port = process.env.PORT || 3000;

import { app } from "./app";



app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});