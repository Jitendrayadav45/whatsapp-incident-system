require("dotenv").config();

const connectDB = require("./src/config/db");
const { receiveMessage } = require("./src/controllers/webhook.controller");

(async () => {
  await connectDB();

  const req = {
    body: {
      "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "id": "wamid.TEST_WELCOME",
          "from": "919999000101",
          "type": "text",
          "text": { "body": "SITE:GITA Oil leakage near machine" }
        }]
      }
    }]
  }]
    }
  };

  const res = {
   sendStatus: (code) => {
  console.log("Response Status:", code);
  // ❌ DO NOT exit immediately
}
  };

  await receiveMessage(req, res);
})();
