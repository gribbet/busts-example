import {
  _void,
  createClient,
  createNode,
  createServer,
  object,
  string,
  u32,
} from "busts";

import { createSimpleChannel } from "./channel";

/*

This outputs eg. 

 ```
Node 4b63cce4: Node 1
Node a8ece6d5: Node 2
Node 4b63cce4: Node 1
Node a8ece6d5: Node 2
```
*/

export const heartbeatService = {
  heartbeat: [object({ timestamp: u32() })],
} as const;

export const infoService = {
  name: [_void(), string()],
} as const;

const channel = createSimpleChannel();
const node1 = createNode(channel);
const node2 = createNode(channel);
const node3 = createNode(channel);

createServer(node1, infoService, {
  name: () => "Node 1",
});

createServer(node2, infoService, {
  name: () => "Node 2",
});

createServer(node3, heartbeatService, {
  heartbeat: async (_, source) => {
    const info = createClient(node3, infoService, source);
    const name = await info.name();
    console.log(`Node ${source?.toString(16).padStart(8, "0")}: ${name}`);
  },
});

const heartbeat1 = createClient(node1, heartbeatService);
const heartbeat2 = createClient(node2, heartbeatService);

setInterval(async () => {
  await heartbeat1.heartbeat({ timestamp: Date.now() });
  await heartbeat2.heartbeat({ timestamp: Date.now() });
}, 1000);
