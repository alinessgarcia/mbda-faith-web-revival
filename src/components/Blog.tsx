import { useEffect } from 'react';

const Blog = () => {
  useEffect(() => {
    // Redireciona para o arquivo HTML estático do blog
    window.location.href = '/blog/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Redirecionando para o Blog...</h2>
        <p>Se não for redirecionado automaticamente, <a href="/blog/index.html" className="text-yellow-custom underline">clique aqui</a></p>
      </div>
    </div>
  );
};

export default Blog;