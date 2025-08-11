export default function TestPage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Test CSS</h1>
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        <h2 className="text-xl font-semibold mb-2">Card Test</h2>
        <p className="text-gray-600 mb-4">
          Ini adalah test untuk memastikan Tailwind CSS bekerja dengan baik.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Button Test
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl">
          <h3 className="font-bold">Gradient Card 1</h3>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl">
          <h3 className="font-bold">Gradient Card 2</h3>
        </div>
      </div>
    </div>
  )
}
