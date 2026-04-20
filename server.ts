import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  /**
   * Saving assessment structure in a nested transaction.
   * In a real PostgreSQL environment, this would use a client transaction block.
   */
  app.post("/api/assessments", async (req, res) => {
    const assessment = req.body;
    const tenant_id = req.headers["x-tenant-id"] || "default-tenant";

    if (!assessment.title || !assessment.questions || assessment.questions.length === 0) {
      return res.status(400).json({ error: "Invalid assessment data: title and at least one question required." });
    }

    try {
      // Simulate PostgreSQL Transaction
      console.log(`[DB] Starting transaction for tenant: ${tenant_id}`);
      
      // 1. Insert/Update Assessment
      // await db.query('INSERT INTO assessments ... ON CONFLICT ...');
      const assessmentId = assessment.id || uuidv4();
      
      // 2. Clear old questions/answers if updating (Part of transaction)
      // await db.query('DELETE FROM questions WHERE assessment_id = $1', [assessmentId]);

      // 3. Insert Questions and Answers
      for (const question of assessment.questions) {
        // Validation: at least one correct answer for multiple/single choice
        if (question.type !== "open_ended") {
          const hasCorrect = question.answers.some((a: any) => a.is_correct);
          if (!hasCorrect) {
            throw new Error(`Question "${question.content}" must have at least one correct answer.`);
          }
        }

        // await db.query('INSERT INTO questions ...');
        // for (const answer of question.answers) {
        //   await db.query('INSERT INTO answers ...');
        // }
      }

      console.log(`[DB] Transaction committed successfully for assessment: ${assessmentId}`);

      res.status(201).json({ 
        message: "Assessment saved successfully",
        id: assessmentId,
        metadata: {
          timestamp: new Date().toISOString(),
          tenant: tenant_id
        }
      });
    } catch (error: any) {
      console.error("[DB] Transaction rolled back:", error.message);
      res.status(500).json({ 
        error: "Failed to save assessment", 
        details: error.message 
      });
    }
  });

  // Mock S3 Media Upload
  app.post("/api/media/upload", (req, res) => {
    // In a real app, use aws-sdk or @aws-sdk/client-s3 to upload to S3
    // Simulate failure occasionally for error handling demo
    if (Math.random() > 0.95) {
      return res.status(500).json({ error: "S3 Upload failed: Connection timeout" });
    }
    
    const mockUrl = `https://s3.amazonaws.com/lms-assets/media-${uuidv4()}.png`;
    res.json({ url: mockUrl });
  });

  // --- Vite Middleware ---
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
    console.log(`LMS Assessment Engine server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
