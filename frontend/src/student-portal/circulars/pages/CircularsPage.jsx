import { useEffect, useState } from "react";

import circularService from "../services/circular.service";

import CircularCard from "../components/CircularCard";

function CircularsPage() {
  const [circulars, setCirculars] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCirculars();
  }, []);

  async function loadCirculars() {
    try {
      const data = await circularService.getCirculars();

      setCirculars(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCirculars = circulars.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-6">Loading Circulars...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Circulars & Notifications</h1>

        <p className="text-gray-500 mt-2">
          Latest university announcements and updates.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search Circular..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      <div className="space-y-4">
        {filteredCirculars.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow text-center">
            No Circulars Found
          </div>
        ) : (
          filteredCirculars.map((circular) => (
            <CircularCard key={circular.id} circular={circular} />
          ))
        )}
      </div>
    </div>
  );
}

export default CircularsPage;
