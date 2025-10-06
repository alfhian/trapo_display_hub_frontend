// src/components/Navbar.tsx

type NavbarProps = {
  title?: string
}

const Navbar = ({ title = "Dashboard" }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-black-900 tracking-tight">Dashboard</h1>
    <div className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 shadow-sm">
    Dzulfikar Azis
    </div>

    </div>
  )
}

export default Navbar
