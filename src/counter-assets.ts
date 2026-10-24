import { ASSETS } from "./assets";
export const COUNTER_ASSETS: Record<string, string> = {
  ...Object.fromEntries(Object.entries(ASSETS).filter(([p]) => !p.endsWith(".jpg"))),
  "sources/schone-292.jpg": "aa9db82de81c9c991ab2b093e95863398601c141cd737118bc783925e9b98416",
  "sources/schone-293.jpg": "ec8e77db5cbe6aa5122d323fa83d7c1742a0bc61ac9838da07004f1281588e1a",
  "sources/schone-294.jpg": "c74471d9067efb9dec7d27f469c3293814ff9b11b20284c829374c4cb2fb038c",
  "sources/schone-295.jpg": "81c617ac8c98e0b0996c8c7a668289d96c58eefc3eb56d75471473f234803aeb",
  "sources/schone-296.jpg": "d2b2232591531aa00c0e2bb9dd3b2baa5b4634d327b87ee856d0af1549d99251",
  "sources/schone-297.jpg": "75813697a94d0caf78496200ac67eca9a1912b83dbccbad6ce89c4f521240e9f",
  "sources/schone-298.jpg": "0d173c3a13921bbb835cc52d3427dccb2efef8240eca9cdb93d0b749401d7a1b",
  "sources/schone-299.jpg": "622db4021216ecaf58464eda58cc9193f4d7ff12314ba02f65bc4f54cf79c375",
  "sources/schone-300.jpg": "9a11e152b23c4e8c5f6a358ca441a13cb1775412cc98c8c0a32f073a53426c17",
  "sources/schone-301.jpg": "6349cac335f23a739a70a34618572acbd985311c9d71bcb003f1e1eb6dc384d7",
  "sources/schone-302.jpg": "ab5fb1c405610d11c19eab1ade2724de00e1e8928d7b9e941f7ef61c4102c62f",
  "sources/schone-303.jpg": "97ba5c68ad545de9b01593c50d2dd0d5c98e5a88587cf91a85276158401ea7e7",
};
