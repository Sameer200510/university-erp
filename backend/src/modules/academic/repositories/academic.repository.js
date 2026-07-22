const prisma = require("../../../config/prisma");

class AcademicRepository {
  async getSubjects() {
    console.log("Repository Hit");
    console.log("Prisma Subject =", prisma.subject);

    return await prisma.subject.findMany({
      orderBy: {
        semester: "asc",
      },
    });
  }

  async getAttendance(studentId) {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId,
      },
    });

    const subjects = await prisma.subject.findMany();

    const present = attendanceRecords.filter(
      (record) => record.status === "PRESENT",
    ).length;

    const absent = attendanceRecords.filter(
      (record) => record.status === "ABSENT",
    ).length;

    const leave = attendanceRecords.filter(
      (record) => record.status === "LEAVE",
    ).length;

    const total = attendanceRecords.length;

    const overallAttendance =
      total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

    const subjectWiseAttendance = subjects.map((subject) => {
      const records = attendanceRecords.filter(
        (record) => record.subjectId === subject.id,
      );

      const subjectPresent = records.filter(
        (record) => record.status === "PRESENT",
      ).length;

      const subjectTotal = records.length;

      const percentage =
        subjectTotal > 0
          ? Number(((subjectPresent / subjectTotal) * 100).toFixed(2))
          : 0;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        facultyName: subject.facultyName,
        present: subjectPresent,
        total: subjectTotal,
        percentage,
      };
    });

    return {
      overallAttendance,
      present,
      absent,
      leave,
      subjects: subjectWiseAttendance,
    };
  }

  async getMarks() {
    return await prisma.marks.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getResults(studentId) {
    console.log("RESULT STUDENT ID =", studentId);

    const results = await prisma.result.findMany({
      where: {
        studentId,
      },
    });

    console.log("RESULTS FOUND =", results.length);

    return results;
  }

  async getAttendanceDetails(studentId, subjectId) {
    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      throw new Error("Subject not found");
    }

    const records = await prisma.attendance.findMany({
      where: {
        studentId,
        subjectId,
      },
      orderBy: {
        date: "asc",
      },
    });

    const present = records.filter(
      (record) => record.status === "PRESENT",
    ).length;

    const absent = records.filter(
      (record) => record.status === "ABSENT",
    ).length;

    const leave = records.filter((record) => record.status === "LEAVE").length;

    const total = records.length;

    const percentage =
      total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

    return {
      subject: {
        id: subject.id,
        name: subject.name,
        facultyName: subject.facultyName,
        code: subject.code,
        credits: subject.credits,
      },

      summary: {
        total,
        present,
        absent,
        leave,
        percentage,
      },

      records,
    };
  }
}

module.exports = new AcademicRepository();
