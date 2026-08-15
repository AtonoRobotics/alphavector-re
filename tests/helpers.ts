import { unsignedRePack } from "../src/binding/pack.js";
import { signPack, generateEd25519, type TrustAnchors } from "../src/contract/signing.js";
import type { PackBinding, RoleBinding } from "../src/contract/types.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function loadUnsignedFixture(): Promise<Omit<PackBinding, "signatures">> {
  const raw = JSON.parse(
    await readFile(path.join(root, "fixtures/packs/re/pack.json"), "utf8"),
  ) as Omit<PackBinding, "signatures">;
  return raw;
}

export function makeAnchors(): {
  anchors: TrustAnchors;
  architectPrivate: string;
  counselPrivate: string;
} {
  const architect = generateEd25519();
  const counsel = generateEd25519();
  return {
    anchors: {
      architectPublicKeyPem: architect.publicKeyPem,
      counselEvalPublicKeyPem: counsel.publicKeyPem,
    },
    architectPrivate: architect.privateKeyPem,
    counselPrivate: counsel.privateKeyPem,
  };
}

export function signedRePack(roles?: RoleBinding[]): {
  binding: PackBinding;
  anchors: TrustAnchors;
  counselPrivate: string;
} {
  const keys = makeAnchors();
  return {
    binding: signPack(unsignedRePack(roles), keys.architectPrivate, keys.counselPrivate),
    anchors: keys.anchors,
    counselPrivate: keys.counselPrivate,
  };
}

export const REPO_ROOT = root;
