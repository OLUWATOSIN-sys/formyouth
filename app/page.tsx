export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 text-center">
        <img
          src="https://www.rccgheavensgate.org/wp-content/uploads/2022/01/cropped-Logo-2.png"
          alt="RCCG Heavens Gate Logo"
          className="w-40 h-40 mx-auto object-contain mb-8"
        />
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 text-white">
          RCCG Heavens Gate
        </h1>
        <p className="text-xl md:text-2xl text-white/60">
          Youth Ministry
        </p>
      </div>
    </div>
  );
}
