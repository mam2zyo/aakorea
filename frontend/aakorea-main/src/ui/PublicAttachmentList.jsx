import './PublicAttachmentList.css'

export function PublicAttachmentList({ attachments }) {
  if (!attachments || attachments.length === 0) return null

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="public-attachment-list">
      <h3 className="public-attachment-list__title">첨부파일 ({attachments.length})</h3>
      <div className="public-attachment-list__items">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={`/api/public/attachments/${attachment.id}`}
            className="public-attachment-item"
            download={attachment.originalName}
          >
            <div className="public-attachment-item__info">
              <span className="public-attachment-item__name" title={attachment.originalName}>
                {attachment.originalName}
              </span>
              <span className="public-attachment-item__meta">
                {formatSize(attachment.fileSize)}
              </span>
            </div>
            <span className="public-attachment-item__download">다운로드</span>
          </a>
        ))}
      </div>
    </div>
  )
}
