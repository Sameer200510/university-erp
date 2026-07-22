const repository = require("../repositories/admitCard.repository");
const pdfService = require("./admitCardPdf.service");

class AdmitCardService {
  async getEligibility(studentId) {
    const config = await repository.getAttendanceConfig();

    const attendance = await repository.getSubjectAttendance(studentId);

    const relaxations = await repository.getRelaxations(studentId);

    const approvedSubjects = relaxations.map((item) => item.subjectId);

    const subjects = attendance.map((item) => {
      const eligible =
        item.percentage >= config.minimumAttendance ||
        approvedSubjects.includes(item.subjectId);

      return {
        subjectId: item.subjectId,
        subjectName: item.subject.name,
        percentage: item.percentage,
        status: eligible ? "ELIGIBLE" : "DEBARRED",
      };
    });

    return {
      minimumAttendance: config.minimumAttendance,
      subjects,
    };
  }

  async generateAdmitCard(studentId) {
    const eligibility = await this.getEligibility(studentId);

    const pdfUrl = await pdfService.generateAdmitCardPdf({
      studentId,
      semester: 5,
      subjects: eligibility.subjects,
    });

    const admitCard = await repository.createAdmitCard({
      studentId,
      semester: 5,
      examType: "END_SEMESTER",
      pdfUrl,
    });

    return admitCard;
  }

  async generateAdmitCard(studentId) {
    const eligibility = await this.getEligibility(studentId);

    const student = await repository.getStudentDetails(studentId);

    const pdfUrl = await pdfService.generateAdmitCardPdf({
      student,
      semester: student.currentSemester || 5,
      subjects: eligibility.subjects,
    });

    return repository.createAdmitCard({
      studentId,
      semester: student.currentSemester || 5,
      examType: "END_SEMESTER",
      pdfUrl,
    });
  }
}

module.exports = new AdmitCardService();
