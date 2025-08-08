import fs from 'fs';
import path from 'path';
import DocumentsTable from './DocumentsTable';

export default function DocumentsPage() {
  const dir = path.join(process.cwd(), 'app/documents/files');
  const files = fs.readdirSync(dir);
  return <DocumentsTable files={files} />;
} 