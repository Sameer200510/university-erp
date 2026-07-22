import React, { useEffect, useState } from "react";
import { academicService } from "../services/academic.service";
import { useAuthStore } from "../../../shared/store/auth.store";

function FeedbackPage() {
  const user = useAuthStore((state) => state.user);

  const [faculties, setFaculties] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPage();
  }, [user?.id]);

  async function loadPage() {
    try {
      setLoading(true);

      const [facultiesData, myFeedback] = await Promise.all([
        academicService.getFaculties(),
        academicService.getMyFeedback(),
      ]);

      const feedbackCompleted =
        myFeedback.length === facultiesData.length && facultiesData.length > 0;

      setAlreadySubmitted(feedbackCompleted);

      setFaculties(facultiesData);

      setFeedbackData(
        facultiesData.map((faculty) => ({
          facultyId: faculty.id,
          semester: 6,
          rating: "",
          comment: "",
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (facultyId, value) => {
    setFeedbackData((prev) =>
      prev.map((item) =>
        item.facultyId === facultyId
          ? {
              ...item,
              rating: Number(value),
            }
          : item,
      ),
    );
  };

  const handleCommentChange = (facultyId, value) => {
    setFeedbackData((prev) =>
      prev.map((item) =>
        item.facultyId === facultyId
          ? {
              ...item,
              comment: value,
            }
          : item,
      ),
    );
  };

  async function handleSubmit() {
    const incomplete = feedbackData.some(
      (item) =>
        !item.rating ||
        item.rating < 1 ||
        item.rating > 10 ||
        !item.comment.trim(),
    );

    if (incomplete) {
      alert(
        "Please provide rating (1-10) and comment for all faculty members.",
      );
      return;
    }

    try {
      setSubmitting(true);

      await academicService.submitFeedback(feedbackData);

      setAlreadySubmitted(true);

      alert("Feedback Submitted Successfully");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to Submit Feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Loading Feedback Form...</h2>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h1 className="text-3xl font-bold mb-3">Feedback Submitted</h1>
          <p className="text-gray-500">
            Your feedback has already been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Teacher Evaluation Feedback</h1>

      <p className="text-gray-500 mb-8">
        Please provide feedback for all faculty members.
      </p>

      <div className="space-y-6">
        {faculties.map((faculty) => {
          const current = feedbackData.find(
            (item) => item.facultyId === faculty.id,
          );

          return (
            <div key={faculty.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">{faculty.name}</h2>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Rating (1-10)</label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={current?.rating || ""}
                  onChange={(e) =>
                    handleRatingChange(faculty.id, e.target.value)
                  }
                  className="border rounded-lg px-4 py-2 w-32"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Comments</label>

                <textarea
                  rows="3"
                  placeholder="Write your feedback..."
                  value={current?.comment || ""}
                  onChange={(e) =>
                    handleCommentChange(faculty.id, e.target.value)
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}

export default FeedbackPage;
