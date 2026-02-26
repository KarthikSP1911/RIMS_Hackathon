const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

class DataRepository {
    async getFastApiData() {
        try {
            console.log(`Forwarding request to FastAPI: ${FASTAPI_URL}/data`);
            const response = await axios.get(`${FASTAPI_URL}/data`);
            return response.data;
        } catch (error) {
            throw new Error(`FastAPI Error: ${error.message}`);
        }
    }
}

module.exports = new DataRepository();
