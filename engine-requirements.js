const [major, minor] = process.versions.node.split('.').map(Number);

// require(esm) sinkron stabil tanpa flag sejak Node v20.19.0 dan v22.12.0
// (lihat index.cjs). Versi 20.x di bawah 20.19, atau 21.x, TIDAK didukung.
const ok = (major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major > 22;

if (!ok) {
  console.error(
    `\n❌ This package requires Node.js >=20.19.0 or >=22.12.0 to run reliably ` +
    `(needs native synchronous require(esm) support).\n` +
    `   You are using Node.js ${process.versions.node}.\n` +
    `   Please upgrade your Node.js version to proceed.\n`
  );
  process.exit(1);
}
