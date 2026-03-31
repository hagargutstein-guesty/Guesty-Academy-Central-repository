import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createServer as createViteServer } from "vite";
import path from "path";

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API Routes

// 1. Initialize Tenant Folders
app.post("/api/tenants/:tenantId/initialize", async (req, res) => {
  const { tenantId } = req.params;

  try {
    // Check if tenant exists, if not create one
    let tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: { id: tenantId, name: "New Tenant" },
      });
    }

    // Check if folders already initialized
    const existingFolders = await prisma.folder.findFirst({
      where: { tenantId, isSystemFolder: true },
    });

    if (existingFolders) {
      return res.status(400).json({ error: "Folders already initialized for this tenant" });
    }

    // Fixed Root Taxonomy
    const rootFolders = ["CEd", "Archived", "External - Partners", "Internal", "Testing"];
    const createdRoots = await Promise.all(
      rootFolders.map((name) =>
        prisma.folder.create({
          data: { name, tenantId, isSystemFolder: true },
        })
      )
    );

    const internalFolder = createdRoots.find((f) => f.name === "Internal");

    if (internalFolder) {
      // Mandatory Sub-Folders for Internal
      const internalSubFolders = [
        "Basic Product Training",
        "Departments/Teams",
        "Guesty Onboarding",
        "Product Education",
        "System and processes",
      ];

      await Promise.all(
        internalSubFolders.map((name) =>
          prisma.folder.create({
            data: {
              name,
              tenantId,
              parentId: internalFolder.id,
              isSystemFolder: true,
            },
          })
        )
      );
    }

    res.json({ message: "Tenant folders initialized successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to initialize folders" });
  }
});

// 2. Get all folders for a tenant
app.get("/api/tenants/:tenantId/folders", async (req, res) => {
  const { tenantId } = req.params;
  try {
    const folders = await prisma.folder.findMany({
      where: { tenantId },
      include: { children: true },
    });
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

// 3. Create a custom folder
app.post("/api/tenants/:tenantId/folders", async (req, res) => {
  const { tenantId } = req.params;
  const { name, parentId } = req.body;

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        tenantId,
        parentId,
        isSystemFolder: false,
      },
    });
    res.json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create folder" });
  }
});

// 4. Delete a custom folder
app.delete("/api/tenants/:tenantId/folders/:folderId", async (req, res) => {
  const { tenantId, folderId } = req.params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId, tenantId },
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (folder.isSystemFolder) {
      return res.status(403).json({ error: "Cannot delete system folders" });
    }

    // Delete assets in folder (or move them, but for simplicity we delete)
    await prisma.asset.deleteMany({
      where: { folderId, tenantId },
    });

    await prisma.folder.delete({
      where: { id: folderId, tenantId },
    });

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
});

// 5. Upload Asset
app.post("/api/tenants/:tenantId/assets", async (req, res) => {
  const { tenantId } = req.params;
  const { name, folderId, url } = req.body;

  if (!folderId) {
    return res.status(400).json({ error: "Folder destination is required" });
  }

  try {
    const asset = await prisma.asset.create({
      data: {
        name,
        folderId,
        tenantId,
        url,
      },
    });
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload asset" });
  }
});

// 5. Get Assets for a folder
app.get("/api/tenants/:tenantId/folders/:folderId/assets", async (req, res) => {
  const { tenantId, folderId } = req.params;
  try {
    const assets = await prisma.asset.findMany({
      where: { tenantId, folderId },
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assets" });
  }
});

// 6. Move Asset
app.put("/api/tenants/:tenantId/assets/:assetId/move", async (req, res) => {
  const { tenantId, assetId } = req.params;
  const { newFolderId } = req.body;

  if (!newFolderId) {
    return res.status(400).json({ error: "New folder destination is required" });
  }

  try {
    const asset = await prisma.asset.update({
      where: { id: assetId, tenantId },
      data: { folderId: newFolderId },
    });
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to move asset" });
  }
});

// Vite middleware for development
async function startServer() {
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
