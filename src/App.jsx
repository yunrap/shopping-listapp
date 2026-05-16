import { useState, useEffect } from "react";
import { recommendations } from "./data/recommendations";

const STORAGE_KEY = "shopping-list-items";

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default function App() {
  const [items, setItems] = useLocalStorage(STORAGE_KEY, []);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState(null);

  function addItem(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (items.some((i) => i.name === trimmed)) return;
    setItems((prev) => [...prev, { id: Date.now(), name: trimmed, checked: false }]);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addItem(input);
  }

  function toggleItem(id) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearChecked() {
    setItems((prev) => prev.filter((i) => !i.checked));
  }

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-emerald-800">🛒 쇼핑 리스트</h1>
          <p className="text-emerald-600 mt-1 text-sm">
            {items.length === 0
              ? "항목을 추가해보세요"
              : `총 ${items.length}개 · 완료 ${checkedCount}개`}
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="항목 입력 후 Enter..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={() => addItem(input)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-sm transition-colors"
          >
            추가
          </button>
        </div>

        {/* Shopping List */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 mb-4 overflow-hidden">
          {items.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              아직 항목이 없어요.<br />아래 추천 리스트에서 추가해보세요!
            </div>
          ) : (
            <ul>
              {items.map((item, idx) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    idx !== items.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.checked
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    {item.checked && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 text-gray-800 ${
                      item.checked ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Clear checked button */}
        {checkedCount > 0 && (
          <button
            onClick={clearChecked}
            className="w-full mb-4 py-2 text-sm text-red-400 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-xl transition-colors bg-white"
          >
            완료된 항목 {checkedCount}개 삭제
          </button>
        )}

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="font-semibold text-gray-700 text-sm">추천 쇼핑 리스트</h2>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-4 pb-2 overflow-x-auto">
            {recommendations.map((rec) => (
              <button
                key={rec.category}
                onClick={() => setActiveTab(activeTab === rec.category ? null : rec.category)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === rec.category
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700"
                }`}
              >
                {rec.emoji} {rec.category}
              </button>
            ))}
          </div>

          {/* Items grid */}
          {activeTab && (
            <div className="px-4 pb-4 pt-1">
              <div className="flex flex-wrap gap-2">
                {recommendations
                  .find((r) => r.category === activeTab)
                  ?.items.map((item) => {
                    const alreadyAdded = items.some((i) => i.name === item);
                    return (
                      <button
                        key={item}
                        onClick={() => !alreadyAdded && addItem(item)}
                        disabled={alreadyAdded}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          alreadyAdded
                            ? "bg-gray-50 text-gray-300 border-gray-200 cursor-default"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {alreadyAdded ? "✓ " : "+ "}{item}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {!activeTab && (
            <div className="px-4 pb-4 text-xs text-gray-400 text-center">
              카테고리를 선택하면 추천 항목이 나타납니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
