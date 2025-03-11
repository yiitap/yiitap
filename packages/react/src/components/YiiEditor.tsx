import React, { useState } from 'react';

interface YiiEditorProps {
  initialContent?: string;
}

const YiiEditor: React.FC<YiiEditorProps> = ({ initialContent = '' }) => {
  const [content, setContent] = useState<string>(initialContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={handleChange}
        rows={10}
        cols={30}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default YiiEditor;
