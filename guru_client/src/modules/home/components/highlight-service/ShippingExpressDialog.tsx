"use client"

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { getFullLinkResource } from "@lib/config"

interface ShippingExpressDialogProps {
  open: boolean
  onClose: () => void
  shippingExpressHtml?: string
}

export default function ShippingExpressDialog({
  open,
  onClose,
  shippingExpressHtml,
}: ShippingExpressDialogProps) {
  // Convert markdown to HTML
  const markdownToHtml = (markdown: string) => {
    if (!markdown) return ""

    let html = markdown

    // Convert markdown headings first (before other processing)
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>")
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>")
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>")

    // Convert markdown images: ![alt](url) to <img alt="alt" src="url" />
    // Use a placeholder to avoid conflicts with link processing
    const imagePlaceholders: string[] = []
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      // Process image URL - convert to full link if needed
      let imageUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        imageUrl = getFullLinkResource(url)
      }
      const placeholder = `__IMAGE_PLACEHOLDER_${imagePlaceholders.length}__`
      imagePlaceholders.push(`<img src="${imageUrl}" alt="${alt || ""}" />`)
      return placeholder
    })

    // Convert markdown links: [text](url) to <a href="url">text</a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    })

    // Replace image placeholders back
    imagePlaceholders.forEach((img, index) => {
      html = html.replace(`__IMAGE_PLACEHOLDER_${index}__`, img)
    })

    // Convert markdown bold: **text** to <strong>text</strong>
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")

    // Convert markdown italic: *text* to <em>text</em>
    // Only match single asterisks that are not part of double asterisks
    html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>")

    // Split by double newlines to create paragraphs
    const paragraphs = html.split(/\n\n+/)

    html = paragraphs
      .map((paragraph) => {
        const trimmed = paragraph.trim()
        if (!trimmed) return ""

        // If already wrapped in HTML tags (like h1, h2, h3, img), return as is
        if (/^<[hH][1-6]|<img/.test(trimmed)) {
          return trimmed
        }

        // Wrap in <p> tag and convert single newlines to <br>
        return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`
      })
      .filter((p) => p)
      .join("")

    return html
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle className="!flex !justify-between !items-center !font-semibold">
        <span>Giao Hoả Tốc</span>
        <IconButton onClick={onClose} className="!p-1" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {shippingExpressHtml ? (
          <div
            className="rich-text-content"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(shippingExpressHtml),
            }}
            style={{
              lineHeight: "1.6",
            }}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nội dung đang được cập nhật...
          </p>
        )}
      </DialogContent>
      <style jsx global>{`
        .rich-text-content {
          color: #374151;
        }
        .rich-text-content p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }
        .rich-text-content h1 {
          font-size: 1.5rem;
        }
        .rich-text-content h2 {
          font-size: 1.25rem;
        }
        .rich-text-content h3 {
          font-size: 1.125rem;
        }
        .rich-text-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
          display: block;
        }
        .rich-text-content ul,
        .rich-text-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .rich-text-content li {
          margin-bottom: 0.5rem;
        }
        .rich-text-content a {
          color: #ec4899;
          text-decoration: underline;
        }
        .rich-text-content a:hover {
          color: #be185d;
        }
        .rich-text-content strong {
          font-weight: 600;
        }
        .rich-text-content em {
          font-style: italic;
        }
      `}</style>
    </Dialog>
  )
}

