import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY });

async function main() {
    const models = await groq.models.list();
    console.log(JSON.stringify(models.data, null, 2));
}

main();
