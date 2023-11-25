/**
 * Build and upload assets
 * for macOS(aarch)
 */
import fs from "fs-extra";
import path from "path";
import { createRequire } from "module";
import { getOctokit, context } from "@actions/github";

const require = createRequire(import.meta.url);

async function resolve() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is required");
  }
  if (!process.env.TAURI_PRIVATE_KEY) {
    throw new Error("TAURI_PRIVATE_KEY is required");
  }
  if (!process.env.TAURI_KEY_PASSWORD) {
    throw new Error("TAURI_KEY_PASSWORD is required");
  }

  const { version } = require("../package.json");

  console.log(`[INFO]: Upload to tag dev`);

  const cwd = process.cwd();
  const bundlePath = path.join(
    cwd,
    "src-tauri/target/aarch64-apple-darwin/release/bundle"
  );
  const join = (p) => path.join(bundlePath, p);

  const appPathList = [
    join("macos/Clash Nyanpasu.aarch64.app.tar.gz"),
    join("macos/Clash Nyanpasu.aarch64.app.tar.gz.sig"),
  ];

  for (const appPath of appPathList) {
    if (fs.pathExistsSync(appPath)) {
      fs.removeSync(appPath);
    }
  }

  fs.copyFileSync(join("macos/Clash Nyanpasu.app.tar.gz"), appPathList[0]);
  fs.copyFileSync(join("macos/Clash Nyanpasu.app.tar.gz.sig"), appPathList[1]);

  const options = { owner: context.repo.owner, repo: context.repo.repo };
  const github = getOctokit(process.env.GITHUB_TOKEN);

  const { data: release } = await github.rest.repos.getReleaseByTag({
    ...options,
    tag,
  });

  if (!release.id) throw new Error("failed to find the release");

  await uploadAssets([
    join(`dmg/Clash Nyanpasu_${version}_aarch64.dmg`),
    ...appPathList,
  ]);
}

// From tauri-apps/tauri-action
// https://github.com/tauri-apps/tauri-action/blob/dev/packages/action/src/upload-release-assets.ts
async function uploadAssets(assets) {
  const github = getOctokit(process.env.GITHUB_TOKEN);
  const options = { owner: context.repo.owner, repo: context.repo.repo };

  for (const assetPath of assets) {
    const { data: release } = await github.rest.repos.getReleaseByTag({
      ...options,
      tag: process.env.TAG_NAME || `v${version}`,
    });

    console.log(release.name);

    await github.rest.repos.uploadReleaseAsset({
      ...options,
      release_id: release.id,
      name: assetPath,
      data: zip.toBuffer(),
    });
  }
}

resolve();
