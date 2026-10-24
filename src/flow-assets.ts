import { ASSETS } from "./assets";
export const FLOW_ASSETS: Record<string, string> = {
  ...Object.fromEntries(Object.entries(ASSETS).filter(([p]) => !p.endsWith(".jpg"))),
  "sources/schone-284.jpg": "32ff109b49eaa77b507c5ade01598f6105686ba3a9d2d9a7c49b7ad1d5916f84",
  "sources/schone-285.jpg": "14dfed8a60a62893904677ff16df23e3793c09b5cf7162391b57e5b1f4def638",
  "sources/schone-286.jpg": "10871f5164d030766903fa41cd037a784cfa1b7bf18a6d8d242782b4d0d2e36f",
  "sources/schone-287.jpg": "f5ceb713d1720b222303ea9472ad0459fcc4fba154faaf6f97c980f24789f1a1",
};
