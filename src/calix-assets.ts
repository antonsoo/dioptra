import { ASSETS } from "./assets";
export const CALIX_ASSETS: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(ASSETS).filter(
      ([p]) => p.startsWith("fonts/") || p === "sources/CC-BY-SA-4.0.txt",
    ),
  ),
  "sources/frontinus/buecheler-014.jpg":
    "deba9c7a2793f77269540135ae7d3ee1757815468a12489c4a0f646f0818b69f",
  "sources/frontinus/buecheler-015.jpg":
    "97d73df780243b9784f7bf67e3319ea337faa2f041ad61753e792398b98d33ae",
  "sources/frontinus/buecheler-017.jpg":
    "9e2b02b031c7a0e9c08f52f46ed62dedf424af26c8e89cea2d1229cac4a2b1bd",
  "sources/frontinus/buecheler-018.jpg":
    "e53aeaad182e2a24c7ffd4ad09bec610659ddfbae658f42d02b1f2039904f326",
  "sources/frontinus/buecheler-019.jpg":
    "ca8c23bc9d5d7effbe7132ebf347fa7898f96c469ae6cc25b8da6f0cbfc4c25a",
  "sources/frontinus/buecheler-title.jpg":
    "b61d8b1f3b038dc47a14962ebaf94f9f23cc36773c00a06f534e8ab6712d2ed1",
  "sources/frontinus/manifest.json":
    "d74332b0431b026472d41d53ca70daaec75f191b27465047585eabd1ebdc1ae5",
  "sources/frontinus/NOTICES.txt":
    "04f8370fcf79607e7c35b7ed42388e36eea776055b8c02f5f085d95aa8d85af5",
};
