"use client";

import { useCallback, useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { CSV_PREVIEW_MAX_ROWS } from "@/lib/constants";

interface CSVUploaderProps {
  onImport: (data: Record<string, string>[], headers: string[]) => void;
  acceptedColumns?: string[];
}

export default function CSVUploader({
  onImport,
  acceptedColumns,
}: CSVUploaderProps) {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      setErrors([]);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data as Record<string, string>[];
          const parsedHeaders = results.meta.fields || [];

          if (acceptedColumns) {
            const missing = acceptedColumns.filter(
              (col) => !parsedHeaders.includes(col)
            );
            if (missing.length > 0) {
              setErrors([
                `Missing required columns: ${missing.join(", ")}`,
              ]);
              return;
            }
          }

          setData(parsed);
          setHeaders(parsedHeaders);
          onImport(parsed, parsedHeaders);
        },
        error: (err) => {
          setErrors([`Parse error: ${err.message}`]);
        },
      });
    },
    [acceptedColumns, onImport]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      processFile(file);
    } else {
      setErrors(["Please upload a CSV file"]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const reset = () => {
    setData([]);
    setHeaders([]);
    setFileName("");
    setErrors([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="w-5 h-5" />
          Import CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!fileName ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Drag and drop a CSV file here, or click to browse
              </p>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{fileName}</span>
              <Button variant="ghost" size="sm" onClick={reset}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {errors.length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                {errors.map((err, i) => (
                  <p key={i} className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {err}
                  </p>
                ))}
              </div>
            )}

            {data.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">
                  {data.length} rows parsed with {headers.length} columns
                </p>
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {headers.map((h) => (
                          <th
                            key={h}
                            className="p-2 text-left font-medium text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, CSV_PREVIEW_MAX_ROWS).map((row, i) => (
                        <tr key={i} className="border-b border-border">
                          {headers.map((h) => (
                            <td key={h} className="p-2">
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.length > CSV_PREVIEW_MAX_ROWS && (
                  <p className="text-xs text-muted-foreground">
                    Showing first {CSV_PREVIEW_MAX_ROWS} of {data.length} rows
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
