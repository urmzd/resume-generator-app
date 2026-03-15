import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Label } from "@/components/ui/label";
import EditorSection from "./EditorSection";

interface SummaryEditorProps {
  value: string;
  onChange: (s: string) => void;
}

export default function SummaryEditor({ value, onChange }: SummaryEditorProps) {
  return (
    <EditorSection title="Summary">
      <div>
        <Label>Summary</Label>
        <MarkdownEditor
          value={value}
          onChange={onChange}
          rows={4}
          placeholder="Professional summary..."
        />
      </div>
    </EditorSection>
  );
}
