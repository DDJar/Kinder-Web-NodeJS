import { Class, Skill } from "../database/index.js";

export async function getList(type, idTeacher) {
  try {
    if (type === "class") {
      return await Class.find({ teacherId: idTeacher });
    }
    // Xử lý cho loại khác nếu cần
    return [];
  } catch (error) {
    console.error("Error fetching list:", error);
    throw new Error("Error fetching list");
  }
}
