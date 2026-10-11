import { Page, TestInfo } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";


export async function finishEvidence(
  page: Page,
  testInfo: TestInfo,
  caseId: string,
  name: string
): Promise<void> {
  await page.waitForTimeout(1000);

  const targetDir = path.resolve(__dirname, "../../evidence/screenshots");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileName = `${caseId}_${name}.png`;
  const screenshotPath = path.join(targetDir, fileName);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  await testInfo.attach(fileName, {
    path: screenshotPath,
    contentType: "image/png",
  });

  console.log(`[Evidence] Saved screenshot for ${caseId} (${name}) at: ${screenshotPath}`);
}
