const DFXWebPackConfig = require("./dfx.webpack.config")
DFXWebPackConfig.initCanisterIds()

const webpack = require("webpack")
const { execFileSync } = require("node:child_process")
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants")

// Resolve on the build machine; the static HTML needs no Git access on ICP.
// BUILD_COMMIT_SHA also supports source archives/CI environments without .git.
function getBuildCommit() {
  if (process.env.BUILD_COMMIT_SHA) return process.env.BUILD_COMMIT_SHA
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: __dirname,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    return "unknown"
  }
}

// Make DFX_NETWORK available to Web Browser with default "local" if DFX_NETWORK is undefined
const EnvPlugin = new webpack.EnvironmentPlugin({
  DFX_NETWORK: "local"
})

module.exports = (phase) => ({
  env: {
    BUILD_COMMIT_SHA: getBuildCommit(),
  },
  // Next 13 uses distDir as the export destination when output is "export"
  // (its production build cache still goes to .next). Match dfx.json's source
  // directory, and isolate the dev cache so builds cannot overwrite it.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : "out",
  webpack: (config) => {
    // Plugin
    config.plugins.push(EnvPlugin)

    // Important: return the modified config
    return config
  },
  output: "export",
  images: {
    unoptimized: true,  // Disable image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-global.website-files.com',
      },
    ],
  },
})
