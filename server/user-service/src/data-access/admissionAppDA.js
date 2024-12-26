import { AdnissionApplication } from "../database/index.js";

async function findAdnissionApplication(condition, select) {
  return await AdnissionApplication.find(condition).select(select);
}
export { findAdnissionApplication };
