// ...existing code...
<div
  className="order-1 lg:order-2 animate-fade-in"
  style={{ animationDelay: "0.4s" }}
>
  <div className="relative group">
    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
    <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
      <img
        src="https://i.imgur.com/SWiMFCc.jpg"
        alt="Igreja MBdA Reconciliação - Vista da fachada e ambiente da comunidade cristã"
        className="rounded-xl shadow-2xl object-cover h-[400px] w-full transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    {/* Botão Google Maps */}
    <div className="flex justify-center mt-6">
      <a
        href="https://www.google.com/maps?q=igreja+mbda+reconciliacao"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-3 bg-white text-[#4285F4] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:bg-gray-50"
        style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '1.1rem', letterSpacing: 0.2 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g>
            <path d="M21.6 12.227c0-1.023-.082-2.047-.254-3.047H12v5.77h5.41a4.63 4.63 0 0 1-2.01 3.04v2.52h3.24c1.89-1.74 2.96-4.31 2.96-8.283z" fill="#4285F4"/>
            <path d="M12 22c2.7 0 4.97-.89 6.63-2.41l-3.24-2.52c-.9.6-2.07.96-3.39.96-2.6 0-4.8-1.76-5.59-4.13H3.06v2.59A9.98 9.98 0 0 0 12 22z" fill="#34A853"/>
            <path d="M6.41 13.9A5.99 5.99 0 0 1 6 12c0-.66.11-1.3.3-1.9V7.51H3.06A9.98 9.98 0 0 0 2 12c0 1.64.39 3.19 1.06 4.49l3.35-2.59z" fill="#FBBC05"/>
            <path d="M12 6.58c1.47 0 2.78.51 3.81 1.51l2.85-2.85C16.97 3.89 14.7 3 12 3A9.98 9.98 0 0 0 3.06 7.51l3.35 2.59C7.2 8.34 9.4 6.58 12 6.58z" fill="#EA4335"/>
          </g>
        </svg>
        Google Maps
      </a>
    </div>
  </div>
</div>
// ...existing code...