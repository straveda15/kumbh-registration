import { Link } from 'react-router-dom';
import { IdCard, UserCog, FolderOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SummaryCard } from './SummaryCard';

export const QuickActionsCard = ({ className }) => (
  <SummaryCard title="Quick Actions" icon={Zap} className={className}>
    <div className="flex flex-col gap-2">
      <Button asChild variant="outline" size="sm" className="justify-start gap-2">
        <Link to="/pass">
          <IdCard className="size-3.5" /> View / Download Pass
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="justify-start gap-2">
        <Link to="/profile">
          <UserCog className="size-3.5" /> Edit Profile
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="justify-start gap-2">
        <Link to="/documents">
          <FolderOpen className="size-3.5" /> Manage Documents
        </Link>
      </Button>
    </div>
  </SummaryCard>
);

export default QuickActionsCard;
