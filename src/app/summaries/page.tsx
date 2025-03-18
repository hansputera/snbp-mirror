"use client";

import { SnbpSchoolSummary } from "@/types/snbp";
import ky from "ky";
import { useState } from "react";

type ChartData = {
  label: string;
  value: number;
  color: string;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    SnbpSchoolSummary["members"] | null
  >(null);
  const [noResults, setNoResults] = useState(false);
  const [searchedSchool, setSearchedSchool] = useState<string | null>(null);
  const [universityData, setUniversityData] = useState<ChartData[]>([]);
  const [majorData, setMajorData] = useState<ChartData[]>([]);

  // Colors for charts
  const colors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-cyan-500",
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setNoResults(false);
      setSearchedSchool(null);
      setUniversityData([]);
      setMajorData([]);
      return;
    }

    const response = await ky
      .get<{ data?: SnbpSchoolSummary }>("/api/summary", {
        searchParams: new URLSearchParams({
          school: searchTerm,
        }),
      })
      .json();
    const school = response.data;

    if (school) {
      setSearchResults(school.members);
      setNoResults(false);
      setSearchedSchool(school.schoolName);

      // Process data for charts
      processChartData(school.members);
    } else {
      setSearchResults(null);
      setNoResults(true);
      setSearchedSchool(null);
      setUniversityData([]);
      setMajorData([]);
    }
  };

  const processChartData = (students: SnbpSchoolSummary["members"]) => {
    // Process university data
    const universities: Record<string, number> = {};
    students.forEach((student) => {
      universities[student.university!] =
        (universities[student.university!] || 0) + 1;
    });

    const universityChartData = Object.entries(universities).map(
      ([label, value], index) => ({
        label,
        value,
        color: colors[index % colors.length],
      })
    );

    // Sort by count (descending)
    universityChartData.sort((a, b) => b.value - a.value);
    setUniversityData(universityChartData);

    // Process major data
    const majors: Record<string, number> = {};
    students.forEach((student) => {
      majors[student.prodi!] = (majors[student.prodi!] || 0) + 1;
    });

    const majorChartData = Object.entries(majors).map(
      ([label, value], index) => ({
        label,
        value,
        color: colors[index % colors.length],
      })
    );

    // Sort by count (descending)
    majorChartData.sort((a, b) => b.value - a.value);
    setMajorData(majorChartData);
  };

  // Calculate max value for university chart
  const maxUniversityValue =
    universityData.length > 0
      ? Math.max(...universityData.map((item) => item.value))
      : 0;

  // Calculate total for pie chart percentages
  const totalStudents = majorData.reduce((sum, item) => sum + item.value, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-full shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600 mb-2">
            SNBP Summaries
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pencarian ringkasan kelulusan SNBP (Seleksi Nasional Berdasarkan
            Prestasi) sekolah tahun {new Date().getFullYear()}
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto mb-8 bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Masukan nama sekolah"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Cari
              </button>
            </div>
          </div>
        </div>

        {/* No Results Alert */}
        {noResults && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-100 border-l-4 border-red-500 rounded-lg shadow overflow-hidden">
            <div className="p-4 flex items-center">
              <div className="flex-shrink-0 bg-red-200 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-red-700">
                No schools found matching your search criteria. Please try a
                different search term.
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
                {searchedSchool}
              </h2>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                <span className="font-medium">{searchResults.length}</span>{" "}
                accepted students
              </div>
            </div>

            {/* Student Data Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Nama Siswa
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Universitas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Jurusan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResults.map((student) => (
                      <tr
                        key={student.name.concat(student.university!)}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {student.university}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                            {student.prodi}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* University Distribution Chart */}
              <div className="bg-white rounded-xl border border-blue-100 shadow-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  Distribusi Universitas
                </h3>
                <div className="space-y-4">
                  {universityData.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                        <span className="text-sm font-medium text-gray-500">
                          {item.value} siswa
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${item.color}`}
                          style={{
                            width: `${
                              (item.value / maxUniversityValue) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Distribution Chart */}
              <div className="bg-white rounded-xl border border-blue-100 shadow-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  Distribusi Jurusan
                </h3>
                <div className="flex justify-center">
                  <div className="relative w-64 h-64">
                    {/* Pie Chart */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {majorData.map((item, index) => {
                        // Calculate pie chart segments
                        const percentage = (item.value / totalStudents) * 100;

                        // Calculate previous segments total percentage
                        const previousPercentage = majorData
                          .slice(0, index)
                          .reduce(
                            (sum, curr) =>
                              sum + (curr.value / totalStudents) * 100,
                            0
                          );

                        // Convert percentages to coordinates on a circle
                        const startX =
                          50 +
                          40 *
                            Math.cos((2 * Math.PI * previousPercentage) / 100);
                        const startY =
                          50 +
                          40 *
                            Math.sin((2 * Math.PI * previousPercentage) / 100);

                        const endX =
                          50 +
                          40 *
                            Math.cos(
                              (2 *
                                Math.PI *
                                (previousPercentage + percentage)) /
                                100
                            );
                        const endY =
                          50 +
                          40 *
                            Math.sin(
                              (2 *
                                Math.PI *
                                (previousPercentage + percentage)) /
                                100
                            );

                        // Determine if the arc should be drawn as a large arc
                        const largeArcFlag = percentage > 50 ? 1 : 0;

                        // Create the SVG arc path
                        const path = [
                          `M 50 50`, // Move to center
                          `L ${startX} ${startY}`, // Line to start point
                          `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc to end point
                          `Z`, // Close path
                        ].join(" ");

                        return (
                          <path
                            key={index}
                            d={path}
                            className={item.color.replace("bg-", "fill-")}
                            stroke="white"
                            strokeWidth="1"
                          />
                        );
                      })}
                      <circle cx="50" cy="50" r="25" fill="white" />
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {majorData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color} mr-2`}
                      ></div>
                      <span className="text-sm text-gray-700 truncate">
                        {item.label}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({Math.round((item.value / totalStudents) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
