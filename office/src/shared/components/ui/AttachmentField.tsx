import { useRef, useState, type ChangeEvent } from 'react'
import { attachmentApi } from '@/shared/api';
import './AttachmentField.css';

export interface Attachment {
  id: string | number;
  originalName: string;
  fileSize: number;
  url?: string;
}

interface AttachmentFieldProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  disabled?: boolean;
}

export function AttachmentField({ attachments, onChange, disabled }: AttachmentFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const newAttachments: Attachment[] = []
      for (const file of files) {
        const data = await attachmentApi.uploadAttachment(file)
        if (data && data.id !== undefined) {
          newAttachments.push(data as Attachment)
        }
      }
      const successfulAttachments = newAttachments.filter(Boolean)
      onChange([...attachments, ...successfulAttachments])
      setError(null)
    } catch (err) {
      console.error('File upload failed:', err)
      setError('파일 업로드에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeAttachment = (id: string | number) => {
    onChange(attachments.filter((a) => a.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="attachment-field">
      <div
        className="attachment-field__upload-zone"
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
        {uploading ? (
          <p>파일을 업로드하는 중입니다...</p>
        ) : (
          <p>
            파일을 마우스로 끌어다 놓거나 <strong>여기</strong>를 클릭하여 첨부하세요.
          </p>
        )}
      </div>

      {error && <div className="attachment-field__error">{error}</div>}

      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.filter(Boolean).map((attachment) => (
            <div key={attachment.id} className="attachment-item">
              <div className="attachment-item__info">
                <span className="attachment-item__name" title={attachment.originalName}>
                  {attachment.originalName}
                </span>
                <span className="attachment-item__meta">
                  {formatSize(attachment.fileSize)}
                </span>
              </div>
              <div className="attachment-item__actions">
                <button
                  type="button"
                  className="ghost-button ghost-button--small ghost-button--danger"
                  onClick={() => removeAttachment(attachment.id)}
                  disabled={disabled}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
