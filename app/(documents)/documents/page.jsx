import fs from 'fs';
import path from 'path';
import DocumentsTable from './DocumentsTable';

export default function DocumentsPage() {
  const dir = path.join(process.cwd(), 'public/files');
  const files = fs.readdirSync(dir);
  return <DocumentsTable files={files} />;
}
