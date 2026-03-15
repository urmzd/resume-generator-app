import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESUME_PATH = path.resolve(
  __dirname,
  "../../assets/example_resumes/software_engineer.yml"
);
const OUTPUT_PDF = path.resolve(__dirname, "../../build/demo-output.pdf");
const SCREENSHOTS = path.resolve(__dirname, "../../assets/screenshots");

// Slow down interactions so the recorded video is easy to follow.
const PAUSE_MS = 1500;

test("Desktop app demo — load, browse templates, save", async ({ page }) => {
  // 1. Navigate to the Wails dev server
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
  await page.waitForTimeout(PAUSE_MS);

  // Screenshot: Drop page (light mode — app defaults to dark, so toggle first)
  await page.screenshot({
    path: path.join(SCREENSHOTS, "drop-page.png"),
    fullPage: true,
  });

  // 2. Load the example resume via the test-only Go binding (bypasses native dialog)
  await page.evaluate(
    async ({ filePath }: { filePath: string }) => {
      const app = (window as any)["go"]["main"]["App"];
      const result = await app["LoadFileFromPath"](filePath);
      const tmpls = await app["GetTemplates"]();
      (window as any).__demoResult = result;
      (window as any).__demoTemplates = tmpls;
    },
    { filePath: RESUME_PATH }
  );

  const templates = await page.evaluate(async () => {
    return (window as any).__demoTemplates;
  });

  // Override OpenFile to return cached result (no native dialog)
  await page.evaluate(() => {
    const app = (window as any)["go"]["main"]["App"];
    const originalOpenFile = app["OpenFile"];
    app["OpenFile"] = async () => {
      return (window as any).__demoResult;
    };
    setTimeout(() => {
      app["OpenFile"] = originalOpenFile;
    }, 5000);
  });

  // Click the "Open File" button on the drop page
  const openButton = page.getByRole("button", { name: /open/i });
  if (await openButton.isVisible()) {
    await openButton.click();
  }

  // Wait for gallery to appear
  await expect(page.locator('[role="tab"]').first()).toBeVisible({
    timeout: 30_000,
  });
  await page.waitForTimeout(PAUSE_MS);

  // Screenshot: Gallery view (default dark mode)
  await page.screenshot({
    path: path.join(SCREENSHOTS, "gallery.png"),
    fullPage: true,
  });

  // 3. Open the editor panel
  const editButton = page.getByRole("button", { name: /edit/i });
  if (await editButton.isVisible()) {
    await editButton.click();
  }
  await page.waitForTimeout(PAUSE_MS);

  // Screenshot: Editor panel open
  await page.screenshot({
    path: path.join(SCREENSHOTS, "editor.png"),
    fullPage: true,
  });

  // Close editor for next screenshots
  if (await editButton.isVisible()) {
    await editButton.click();
  }
  await page.waitForTimeout(500);

  // 4. Toggle to light mode
  // The theme toggle button has Moon/Sun icon — find it by the icon button
  const themeButton = page.locator("header button").first();
  await themeButton.click();
  await page.waitForTimeout(PAUSE_MS);

  // Screenshot: Gallery in light mode
  await page.screenshot({
    path: path.join(SCREENSHOTS, "gallery-light.png"),
    fullPage: true,
  });

  // Toggle back to dark mode
  await themeButton.click();
  await page.waitForTimeout(500);

  // 5. Click through template thumbnails
  const tabs = page.locator('[role="tab"]');
  const tabCount = await tabs.count();

  for (let i = 1; i < Math.min(tabCount, 4); i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(PAUSE_MS * 2);
  }

  // Go back to first template
  if (tabCount > 1) {
    await tabs.first().click();
    await page.waitForTimeout(PAUSE_MS);
  }

  // Screenshot: Hero image (gallery with first template selected)
  await page.screenshot({
    path: path.resolve(__dirname, "../../assets/demo-desktop.png"),
    fullPage: true,
  });

  // 6. Save PDF via the test-only binding (bypasses native Save dialog)
  await page.evaluate(
    async ({
      templateName,
      outputPath,
    }: {
      templateName: string;
      outputPath: string;
    }) => {
      await (window as any)["go"]["main"]["App"]["SavePDFToPath"](
        templateName,
        outputPath
      );
    },
    {
      templateName: templates[0]?.name ?? "modern-html",
      outputPath: OUTPUT_PDF,
    }
  );

  await page.waitForTimeout(PAUSE_MS);
});
