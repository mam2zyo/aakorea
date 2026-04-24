import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'
import { useCallback, useEffect, type ReactNode } from 'react'

import { assetApi } from '@/shared/api';
import './RichTextEditor.css';

interface RichTextEditorProps {
  valueHtml?: string;
  valueJson?: string;
  onChange: (value: { html: string; json: string }) => void;
  disabled?: boolean;
}

export function RichTextEditor({ valueHtml, valueJson, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: valueJson ? JSON.parse(valueJson) : (valueHtml || ''),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange({
        html: editor.getHTML(),
        json: JSON.stringify(editor.getJSON()),
      })
    },
  })

  useEffect(() => {
    if (editor && disabled !== !editor.isEditable) {
      editor.setEditable(!disabled)
    }
  }, [editor, disabled])

  const addImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const data = await assetApi.uploadAsset(file)
        if (data && data.url && editor) {
          editor.chain().focus().setImage({ src: data.url }).run()
        }
      } catch {
        window.alert('이미지 업로드에 실패했습니다.')
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('링크 URL을 입력하세요', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className={`rich-text-editor ${disabled ? 'rich-text-editor--disabled' : ''}`}>
      <div className="rich-text-editor__toolbar">
        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            icon={<Heading2 size={18} />}
            label="제목 2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<Heading3 size={18} />}
            label="제목 3"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={!editor.isEditable}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            icon={<Bold size={18} />}
            label="굵게"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<Italic size={18} />}
            label="기울임"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<Strikethrough size={18} />}
            label="취소선"
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<LinkIcon size={18} />}
            label="링크"
            active={editor.isActive('link')}
            onClick={setLink}
            disabled={!editor.isEditable}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            icon={<AlignLeft size={18} />}
            label="왼쪽 정렬"
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<AlignCenter size={18} />}
            label="가운데 정렬"
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<AlignRight size={18} />}
            label="오른쪽 정렬"
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            disabled={!editor.isEditable}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            icon={<List size={18} />}
            label="글머리 기호"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<ListOrdered size={18} />}
            label="번호 매기기"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.isEditable}
          />
          <ToolbarButton
            icon={<Quote size={18} />}
            label="인용구"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.isEditable}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            icon={<ImageIcon size={18} />}
            label="이미지 삽입"
            onClick={addImage}
            disabled={!editor.isEditable}
          />
        </div>
      </div>

      <div 
        className="rich-text-editor__content" 
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
}

function ToolbarButton({ onClick, active, icon, label, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`rich-text-editor__toolbar-btn ${active ? 'rich-text-editor__toolbar-btn--active' : ''}`}
      onClick={onClick}
      title={label}
      disabled={disabled}
    >
      {icon}
    </button>
  )
}
