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
import { useCallback, useEffect } from 'react'

import { adminAssetApi } from '../../features/asset/api/admin'

import './RichTextEditor.css'

export function RichTextEditor({ valueHtml, valueJson, onChange, disabled }) {
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
    input.onchange = async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const data = await adminAssetApi.uploadAsset(file)
        if (data && data.url) {
          editor.chain().focus().setImage({ src: data.url }).run()
        }
      } catch (err) {
        window.alert('이미지 업로드에 실패했습니다.')
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
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
            editor={editor}
            icon={Heading2}
            title="제목 2"
            isActive={editor.isActive('heading', { level: 2 })}
            action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            editor={editor}
            icon={Heading3}
            title="제목 3"
            isActive={editor.isActive('heading', { level: 3 })}
            action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            editor={editor}
            icon={Bold}
            title="굵게"
            isActive={editor.isActive('bold')}
            action={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            editor={editor}
            icon={Italic}
            title="기울임"
            isActive={editor.isActive('italic')}
            action={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            editor={editor}
            icon={Strikethrough}
            title="취소선"
            isActive={editor.isActive('strike')}
            action={() => editor.chain().focus().toggleStrike().run()}
          />
          <ToolbarButton
            editor={editor}
            icon={LinkIcon}
            title="링크"
            isActive={editor.isActive('link')}
            action={setLink}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            editor={editor}
            icon={AlignLeft}
            title="왼쪽 정렬"
            isActive={editor.isActive({ textAlign: 'left' })}
            action={() => editor.chain().focus().setTextAlign('left').run()}
          />
          <ToolbarButton
            editor={editor}
            icon={AlignCenter}
            title="가운데 정렬"
            isActive={editor.isActive({ textAlign: 'center' })}
            action={() => editor.chain().focus().setTextAlign('center').run()}
          />
          <ToolbarButton
            editor={editor}
            icon={AlignRight}
            title="오른쪽 정렬"
            isActive={editor.isActive({ textAlign: 'right' })}
            action={() => editor.chain().focus().setTextAlign('right').run()}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            editor={editor}
            icon={List}
            title="글머리 기호"
            isActive={editor.isActive('bulletList')}
            action={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            editor={editor}
            icon={ListOrdered}
            title="번호 매기기"
            isActive={editor.isActive('orderedList')}
            action={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            editor={editor}
            icon={Quote}
            title="인용구"
            isActive={editor.isActive('blockquote')}
            action={() => editor.chain().focus().toggleBlockquote().run()}
          />
        </div>

        <div className="rich-text-editor__toolbar-divider" />

        <div className="rich-text-editor__toolbar-group">
          <ToolbarButton
            editor={editor}
            icon={ImageIcon}
            title="이미지 삽입"
            action={addImage}
          />
        </div>
      </div>

      <EditorContent className="rich-text-editor__content" editor={editor} />
    </div>
  )
}

function ToolbarButton({ editor, icon: Icon, title, action, isActive }) {
  return (
    <button
      type="button"
      className={`rich-text-editor__toolbar-btn ${isActive ? 'rich-text-editor__toolbar-btn--active' : ''}`}
      onClick={action}
      title={title}
      disabled={!editor.isEditable}
    >
      <Icon size={18} />
    </button>
  )
}
