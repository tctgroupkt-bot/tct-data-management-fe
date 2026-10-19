import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"],
];

export default function QuillEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = "",
}: QuillEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hostRef.current || quillRef.current) return;

    hostRef.current.innerHTML = "";

    const editorElement = document.createElement("div");
    hostRef.current.appendChild(editorElement);

    const quill = new Quill(editorElement, {
      theme: "snow",
      readOnly,
      placeholder,
      modules: {
        toolbar: readOnly ? false : toolbarOptions,
      },
    });

    quillRef.current = quill;

    if (value) {
      isSyncingRef.current = true;
      quill.clipboard.dangerouslyPasteHTML(value);
      isSyncingRef.current = false;
    }

    const handleTextChange = () => {
      if (isSyncingRef.current) return;
      const html = quill.root.innerHTML;
      onChangeRef.current(html === "<p><br></p>" ? "" : html);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
      quillRef.current = null;
      if (hostRef.current) {
        hostRef.current.innerHTML = "";
      }
    };
  }, [placeholder, readOnly]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    quill.enable(!readOnly);

    const currentValue =
      quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;
    const nextValue = value || "";

    if (currentValue === nextValue) return;

    const selection = quill.getSelection();
    isSyncingRef.current = true;
    quill.clipboard.dangerouslyPasteHTML(nextValue);
    isSyncingRef.current = false;

    if (selection) {
      quill.setSelection(selection.index, selection.length);
    }
  }, [value, readOnly]);

  return <div ref={hostRef} className={className} />;
}