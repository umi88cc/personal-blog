import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuthStore } from '../../stores/authStore';

interface SecretBlockProps {
  type: 'login' | 'reply';
  content: string;
  hasCommented?: boolean;
}

export const SecretBlock: React.FC<SecretBlockProps> = ({ type, content, hasCommented }) => {
  // 从状态管理获取当前用户的登录状态
  const { isAuthenticated } = useAuthStore();

  let isVisible = false;
  let message = '';

  // 判断是否可见
  if (type === 'login') {
    isVisible = isAuthenticated;
    message = '🔒 此处内容隐藏，请【登录】后查看';
  } else if (type === 'reply') {
    isVisible = isAuthenticated && hasCommented;
    message = '🔒 此处内容隐藏，请【登录并发表评论】后查看';
  }

  // 如果满足条件，展示隐藏的 Markdown 内容
  if (isVisible) {
    return (
      <div className="my-6 p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-lg dark:bg-emerald-900/20 dark:border-emerald-600">
        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
          内容已解锁
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  // 如果不满足条件，展示提示信息
  return (
    <div className="my-6 py-8 px-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg text-center dark:bg-gray-800 dark:border-gray-600">
      <p className="text-gray-600 dark:text-gray-300 font-medium">{message}</p>
      {!isAuthenticated && (
        <a href="/login" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
          前往登录
        </a>
      )}
      {(isAuthenticated && type === 'reply' && !hasCommented) && (
        <a href="#comments" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
          前往评论区
        </a>
      )}
    </div>
  );
};
