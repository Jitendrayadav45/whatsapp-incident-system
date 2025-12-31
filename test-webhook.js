require("dotenv").config();

const connectDB = require("./src/config/db");
const { receiveMessage } = require("./src/controllers/webhook.controller");

(async () => {
  await connectDB();

  const req = {
    body: {
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: "wamid.TEST125",
              from: "919999998888",
              type: "text",
              text: {
                body: "SITE:GITA Oil leakage near kjcnvdk dbfkdjs machine"
              }
            }]
          }
        }]
      }]
    }
  };

  const res = {
    sendStatus: (code) => {
      console.log("Response Status:", code);
      process.exit(0);
    }
  };

  await receiveMessage(req, res);
})();
