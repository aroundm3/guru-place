import { RichTextBlock } from "types/global"

export default function RichTextBlockRender({
  blocks,
}: {
  blocks: RichTextBlock[]
}) {
  return (
    <div className="prose max-w-none">
      {blocks.map((block, idx) => {
        const renderText = (child: any, i: number) => {
          let text = child.text
          if (child.bold) text = <strong key={i}>{text}</strong>
          if (child.italic) text = <em key={i}>{text}</em>
          if (child.underline) text = <u key={i}>{text}</u>
          return typeof text === "string" ? <span key={i}>{text}</span> : text
        }

        switch (block.type) {
          case "paragraph":
            return <p key={idx}>{block.children.map(renderText)}</p>
          case "heading":
            const H = `h${block.level || 2}` as keyof JSX.IntrinsicElements
            return <H key={idx}>{block.children.map(renderText)}</H>
          case "link":
            return (
              <a key={idx} href={block.url} className="text-blue-600 underline">
                {block.children.map(renderText)}
              </a>
            )
          case "list":
            return (
              <ul key={idx}>
                {block.children.map((child, i) => (
                  <li key={i}>{renderText(child, i)}</li>
                ))}
              </ul>
            )
          default:
            return <p key={idx}>{block.children.map(renderText)}</p>
        }
      })}
    </div>
  )
}
