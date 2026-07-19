import { Link } from 'react-router-dom';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SummaryCard } from './SummaryCard';

export const DocumentsSummaryCard = ({ documents, isLoading }) => {
  const count = documents?.length ?? 0;

  return (
    <SummaryCard title="Uploaded Documents" icon={FolderOpen}>
      {isLoading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : count > 0 ? (
        <p className="text-xs text-muted-foreground">
          {count} document{count === 1 ? '' : 's'} uploaded.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">No documents uploaded yet.</p>
      )}
      <Button asChild variant="outline" size="sm" className="mt-1 w-fit gap-1.5">
        <Link to="/documents">
          Manage Documents <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </SummaryCard>
  );
};

export default DocumentsSummaryCard;
