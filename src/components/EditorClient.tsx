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
        menubar: false,
        branding: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'table', 'help', 'wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat',
        content_style: `
          body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 12px;
            padding: 4px;
            background: #fafafa;
          }
        `,
      }}
    />
  );
}
