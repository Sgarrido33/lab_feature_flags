import * as LaunchDarkly from "@launchdarkly/node-server-sdk";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const client = LaunchDarkly.init(process.env.LD_SDK_KEY);

const context = {
  kind: "user",
  key: "user-key-123abcde",
  email: "biz@face.dev",
};

client.once("ready", function () {
  console.log("SDK successfully initialized!");

  app.get("/", async (req, res) => {
    // Tracking your memberId lets us know you are connected.
    client.track(process.env.LD_EVENT_KEY, context);

    // Check feature flag value
    client.variation(
      "feat-new-menu",
      context,
      false,
      function (err, showFeature) {
        if (showFeature) {
          console.log("feature true");
          res.send("Feature flag is ON");
        } else {
          console.log("feature false");
          res.send("Feature flag is OFF");
        }
      }
    );
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
