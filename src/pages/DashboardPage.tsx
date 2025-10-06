import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'

function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 max-h-screen overflow-y-scroll">
        <Navbar />

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
        {[1, 2, 3, 4].map((num) => (
        <Card
          key={num}
          number={num}
          status={num === 4 ? 'Inactive' : 'Active'}
          date="29-Sep-2025"
        />
      ))}
    </div>

        {/* Numbered Squares Grid */}
    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((num) => (
        <div className='w-full'>
          <div
            key={num}
            className="bg-gray-200 aspect-video flex items-center justify-center text-4xl font-bold text-gray-500 square-lg"
          >
          {num}
        </div>
    </div>
  ))}
</div>

      </main>
    </div>
  )
}

export default DashboardPage
