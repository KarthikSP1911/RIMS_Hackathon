const dataRepository = require('../repositories/dataRepository');

class DataService {
    async fetchAndFormatData() {
        const data = await dataRepository.getFastApiData();
        return {
            express_context: "This data was fetched and processed by Express Service layer",
            fastapi_response: data,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new DataService();
