export default function Demo() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">CSS / Tailwind 测试页面</h1>

      {/* 1. 文字样式 */}
      <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">1. 文字样式</h2>
        <p className="text-gray-600 mb-2">普通文字 - 这是一段测试文字</p>
        <p className="text-sm text-gray-500 mb-2">小字 - text-sm</p>
        <p className="text-xs text-gray-400 mb-2">更小的字 - text-xs</p>
        <p className="font-bold text-black">粗体文字 - font-bold</p>
        <p className="text-blue-600">蓝色文字 - text-blue-600</p>
        <p className="text-red-600">红色文字 - text-red-600</p>
        <p className="text-emerald-600">翠绿色文字 - text-emerald-600</p>
      </section>

      {/* 2. 按钮样式 */}
      <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">2. 按钮样式</h2>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            黑色按钮
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            蓝色按钮
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
            绿色按钮
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
            琥珀色按钮
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300">
            灰色边框按钮
          </button>
          <button className="px-4 py-2 bg-white text-black rounded-full border border-black hover:shadow-lg">
            圆形按钮
          </button>
        </div>
      </section>

      {/* 3. 卡片样式 */}
      <section className="mb-10 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-xl font-bold mb-4">3. 卡片样式</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold mb-2">卡片 1</h3>
            <p className="text-gray-600 text-sm">这是一个测试卡片，带有边框和阴影效果。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold mb-2">卡片 2</h3>
            <p className="text-gray-600 text-sm">这是第二个测试卡片，测试 grid 布局。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold mb-2">卡片 3</h3>
            <p className="text-gray-600 text-sm">这是第三个测试卡片，测试响应式。</p>
          </div>
        </div>
      </section>

      {/* 4. 表单元素 */}
      <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">4. 表单元素</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输入框</label>
            <input
              type="text"
              placeholder="请输入内容..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">下拉选择</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>选项 1</option>
              <option>选项 2</option>
              <option>选项 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">复选框</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-gray-700">选项 A</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-gray-700">选项 B</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 表格 */}
      <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">5. 表格</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">姓名</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">年龄</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">城市</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4">张三</td>
              <td className="py-3 px-4">25</td>
              <td className="py-3 px-4">北京</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">活跃</span></td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4">李四</td>
              <td className="py-3 px-4">30</td>
              <td className="py-3 px-4">上海</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">离线</span></td>
            </tr>
            <tr>
              <td className="py-3 px-4">王五</td>
              <td className="py-3 px-4">28</td>
              <td className="py-3 px-4">深圳</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">隐身</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 6. 徽章 / Badge */}
      <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">6. 徽章 Badge</h2>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">灰色</span>
          <span className="px-3 py-1 bg-black text-white rounded-full text-sm">黑色</span>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">蓝色</span>
          <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm">绿色</span>
          <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm">琥珀色</span>
          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">红色</span>
        </div>
      </section>

      {/* 7. 进度条 */}
      <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">7. 进度条</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">进度 25%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-400 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">进度 50%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">进度 75%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">进度 100%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 8. 警告/提示框 */}
      <section className="mb-10 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-xl font-bold mb-4">8. 警告/提示框</h2>
        <div className="space-y-3">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800 text-sm">✓ 成功提示：操作已完成</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">ℹ️ 信息提示：这是一条普通信息</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">⚠️ 警告提示：请注意此操作</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">✕ 错误提示：操作失败，请重试</p>
          </div>
        </div>
      </section>
    </div>
  )
}
