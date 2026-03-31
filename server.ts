import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    let manifestEntry = null;
    let tincanEntry = null;

    for (const entry of zipEntries) {
      if (entry.entryName.toLowerCase() === "imsmanifest.xml") {
        manifestEntry = entry;
      } else if (entry.entryName.toLowerCase() === "tincan.xml") {
        tincanEntry = entry;
      }
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    if (manifestEntry) {
      // SCORM
      const xmlData = manifestEntry.getData().toString("utf8");
      const jsonObj = parser.parse(xmlData);

      let entryPoint = null;
      let title = "Unknown SCORM Course";

      try {
        const manifest = jsonObj.manifest;
        if (manifest.organizations && manifest.organizations.organization) {
          const org = Array.isArray(manifest.organizations.organization)
            ? manifest.organizations.organization[0]
            : manifest.organizations.organization;
          title = org.title || title;
        }

        if (manifest.resources && manifest.resources.resource) {
          const resources = Array.isArray(manifest.resources.resource)
            ? manifest.resources.resource
            : [manifest.resources.resource];
          
          // Find the first resource with an href, usually the entry point
          for (const res of resources) {
            if (res["@_href"]) {
              entryPoint = res["@_href"];
              break;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing SCORM manifest:", e);
      }

      return res.json({
        type: "SCORM",
        title,
        entryPoint,
        message: "SCORM package processed successfully",
      });
    } else if (tincanEntry) {
      // xAPI
      const xmlData = tincanEntry.getData().toString("utf8");
      const jsonObj = parser.parse(xmlData);

      let entryPoint = null;
      let title = "Unknown xAPI Course";

      try {
        const tincan = jsonObj.tincan;
        if (tincan.activities && tincan.activities.activity) {
          const activity = Array.isArray(tincan.activities.activity)
            ? tincan.activities.activity[0]
            : tincan.activities.activity;
          
          if (activity.name) {
            title = activity.name["#text"] || activity.name;
          }
          
          if (activity.launch) {
            entryPoint = activity.launch;
          }
        }
      } catch (e) {
        console.error("Error parsing xAPI tincan.xml:", e);
      }

      return res.json({
        type: "xAPI",
        title,
        entryPoint,
        message: "xAPI package processed successfully",
      });
    } else {
      return res.status(400).json({
        error: "Invalid package: Neither imsmanifest.xml nor tincan.xml found in the root of the zip file.",
      });
    }
  } catch (error) {
    console.error("Error processing zip file:", error);
    return res.status(500).json({ error: "Failed to process the zip file." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
