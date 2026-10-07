export default function HeaderDaftarTempat() {
  return (
    <div className="bg-white py-12 px-6 text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
        Cari & Bandingkan Tempat PKL{" "}
        <span className="text-blue-600 block">Sesuai Kompetensi Jurusanmu</span>
      </h1>
      <p className="text-gray-600 text-sm max-w-2xl mx-auto mt-3">
        Dapatkan informasi transparan mengenai jobdesk harian, besaran uang saku, sisa kuota, serta ulasan nyata kakak kelas terdahulu.
      </p>
      
      <div className="mt-6 max-w-xl mx-auto flex gap-2">
        <input 
          type="text" 
          placeholder="Cari nama PT, jurusan, dll..." 
          className="w-full px-4 py-2.5 border rounded-full text-sm bg-gray-50 focus:outline-none"
        />
        <button className="bg-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-medium">
          Cari
        </button>
      </div>
    </div>
  );
}