export default function MenuService() {
  return (
    <div className="bg-pink-50 p-6 rounded-md border-2 border-pink-700">
      <div className="container mx-auto">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          <div className="min-w-[250px] bg-stone-50 rounded-lg shadow-md p-4 flex-shrsink-0 border-2 border-pink-500">
            <h2 className="text-xl font-semibold text-pink-700 border-b border-gray-300 pb-2">
              Gội Đầu Cơ Bản - 39k
            </h2>
            <p className="text-gray-600 italic mb-2">Dầu gội cơ bản</p>
            <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
              <li>Gội nước 1</li>
              <li>Rửa mặt</li>
              <li>Massage mặt</li>
              <li>Gội nước 2</li>
              <li>Ủ xả</li>
              <li>Massage đầu</li>
              <li>Sấy</li>
            </ul>
          </div>

          {/* Gội Đầu Cổ Vai Gáy */}
          <div className="min-w-[250px] bg-stone-50 rounded-lg shadow-md p-4 flex-shrink-0 border-2 border-pink-500">
            <h2 className="text-xl  font-semibold text-pink-700 border-b border-gray-300 pb-2">
              Gội Đầu Cổ Vai Gáy - 69k
            </h2>
            <p className="text-gray-600 italic mb-2">
              Dầu gội tự chọn trong shop
            </p>
            <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
              <li>Rửa mặt</li>
              <li>Tẩy da chết</li>
              <li>Gội nước 1</li>
              <li>Massage mặt</li>
              <li>Đắp mặt</li>
              <li>Gội nước 2</li>
              <li>Ủ xả</li>
              <li>Rửa tai</li>
              <li>Massage đầu lần 1</li>
              <li>Massage cổ vai gáy</li>
              <li>Massage đầu lần 2</li>
              <li>Massage khăn nóng</li>
              <li>Sấy</li>
            </ul>
          </div>

          {/* Gội Đầu Dưỡng Sinh */}
          <div className="min-w-[250px] bg-stone-50 rounded-lg shadow-md p-4 flex-shrink-0 border-2 border-pink-500">
            <h2 className="text-xl  font-semibold text-pink-700 border-b border-gray-300 pb-2">
              Gội Đầu Dưỡng Sinh (90p) - 159k
            </h2>
            <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
              <li>Thư giãn bằng tinh dầu ngải</li>
              <li>Đả thông kinh lạc (30p)</li>
              <li>Gội nước 1</li>
              <li>Gội nước 2</li>
              <li>Rửa tai</li>
              <li>Massage đầu lần 1</li>
              <li>Massage cổ vai gáy</li>
              <li>Massage đầu lần 2</li>
              <li>Massage khăn nóng</li>
            </ul>
          </div>

          {/* Tẩy Tế Bào Chết Da Đầu */}
          <div className="min-w-[250px] bg-stone-50 rounded-lg shadow-md p-4 flex-shrink-0 border-2 border-pink-500">
            <h2 className="text-xl  font-semibold text-pink-700 border-b border-gray-300 pb-2">
              Tẩy Tế Bào Chết Da Đầu - 29k
            </h2>
            <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
              <li>Đắp mặt nạ</li>
              <li>Ngâm chân: 19k</li>
            </ul>
          </div>

          {/* Xoa Tinh Dầu Tóc */}
          <div className="min-w-[250px] bg-stone-50 rounded-lg shadow-md p-4 flex-shrink-0 border-2 border-pink-500">
            <h2 className="text-xl  font-semibold text-pink-700 border-b border-gray-300 pb-2">
              Xoa Tinh Dầu Tóc - 15k
            </h2>
            <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
              <li>Xịt dưỡng tóc: 15k</li>
              <li>Phủ đen/nâu: 99k</li>
              <li>Hấp tóc tiêu chuẩn: 99k</li>
              <li>Hấp tóc cao cấp: 139k</li>
            </ul>
          </div>

          {/* Combo */}
          <div className="min-w-[250px] bg-stone-50 rounded-lg shadow-md p-4 flex-shrink-0 border-2 border-pink-500">
            <h2 className="text-xl  font-semibold text-pink-700 border-b border-gray-300 pb-2">
              Combo Ưu Đãi
            </h2>
            <p className="text-gray-700">
              Mua 10 buổi gội, tặng 1 buổi miễn phí
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
