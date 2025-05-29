'use client';

import { Editor } from '@tinymce/tinymce-react';

type EditorClientProps = {
  value: string;
  onChange: (content: string) => void;
};

export default function EditorClient({ value, onChange }: EditorClientProps) {

  return (
    <Editor
      value={value}
      onEditorChange={onChange}
      apiKey="865zrpzt6zbwo6s0wbu30dvbe8m3x9agv6acmzlnofdnu3y7"
      init={{
        height: 500,
        menubar: true,
        branding: false,
        onboarding: false,
        skin: "naked",
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview', 'anchor',
          'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'table', 'help', 'wordcount'
        ],
        content_style: `
          body {
            font-size: 12px;
            background: #fafafa;
          }
        `
      }}
    />
  );
}