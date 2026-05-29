const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});