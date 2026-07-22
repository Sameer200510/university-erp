-- CreateIndex
CREATE INDEX "SubjectAttendanceSummary_studentId_idx" ON "SubjectAttendanceSummary"("studentId");

-- CreateIndex
CREATE INDEX "SubjectAttendanceSummary_subjectId_idx" ON "SubjectAttendanceSummary"("subjectId");

-- AddForeignKey
ALTER TABLE "SubjectAttendanceSummary" ADD CONSTRAINT "SubjectAttendanceSummary_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
