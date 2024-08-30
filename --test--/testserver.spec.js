const app = require('../src/server/server'); // Import the server module

describe("Testing the Express server", () => {
    test("The Express app should be defined", () => {
        expect(app).toBeDefined(); // Check that the app is defined
    });
});