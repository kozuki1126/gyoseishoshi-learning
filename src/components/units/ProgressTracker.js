import { useState } from 'react';

// 学習進捗を追跡するコンポーネント
export default function ProgressTracker({ progress, saveProgress }) {
  const handleProgressChange = (newProgress) => {
    saveProgress(newProgress);
  };

  return (
    <div>
      {/* 進捗バー */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
              進捗状況
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-indigo-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
          ></div>
        </div>
      </div>

      {/* 進捗更新ボタン */}
      <div className="flex flex-wrap -mx-2">
        {[0, 25, 50, 75, 100].map((value) => (
          <div key={value} className="px-2 mb-2">
            <button
              onClick={() => handleProgressChange(value)}
              className={`text-xs px-3 py-1 rounded-full ${
                progress === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {value}%
            </button>
          </div>
        ))}
      </div>

      {/* 学習状態 */}
      <div className="mt-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${progress === 0 ? 'bg-gray-300' : progress < 100 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          <span className="text-sm text-gray-700">
            {progress === 0
              ? '未学習'
              : progress < 100
              ? '学習中'
              : '学習完了'}
          </span>
        </div>
      </div>
    </div>
  );
}