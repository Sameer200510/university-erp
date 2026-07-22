function CurrentDueCard({ currentDue }) {
  if (!currentDue) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold">No Pending Dues 🎉</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Current Due</h2>

      <div className="space-y-3">
        <p>
          Semester:
          <span className="font-bold ml-2">{currentDue.semester}</span>
        </p>

        <p>
          Amount:
          <span className="font-bold ml-2 text-red-600">
            ₹ {currentDue.amount.toLocaleString()}
          </span>
        </p>

        <p>
          Due Date:
          <span className="font-bold ml-2">
            {new Date(currentDue.dueDate).toLocaleDateString()}
          </span>
        </p>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default CurrentDueCard;
