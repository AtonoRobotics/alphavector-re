import { PRODUCT } from "../identity.js";
import type { PackIdentity } from "../contract/types.js";

export const PACK_IDENTITY: PackIdentity = {
  packId: PRODUCT.package,
  version: "0.1.0",
  displayName: PRODUCT.appDisplay,
};
