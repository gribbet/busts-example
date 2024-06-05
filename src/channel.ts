import type { Channel } from "busts";

export const createSimpleChannel = () => {
  let readers: ((_: Uint8Array) => void)[] = [];

  const read = (reader: (_: Uint8Array) => void) => {
    readers = [...readers, reader];
    return () => {
      readers = readers.filter(_ => _ !== reader);
    };
  };

  const write = (_: Uint8Array) => readers.forEach(reader => reader(_));

  const destroy = () => {};

  return { read, write, destroy } satisfies Channel<Uint8Array>;
};
