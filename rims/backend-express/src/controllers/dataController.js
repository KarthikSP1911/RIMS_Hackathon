const dataService = require('../services/dataService');

class DataController {
    async getFastApiData(req, res) {
        try {
            const data = await dataService.fetchAndFormatData();
            res.json(data);
        } catch (error) {
            console.error("Controller Error:", error.message);
            res.status(500).json({ 
                error: "Internal Server Error",
                details: error.message 
            });
        }
    }
}

module.exports = new DataController();
