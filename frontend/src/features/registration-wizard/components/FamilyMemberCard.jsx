import { Pencil, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const FamilyMemberCard = ({ members, onEdit, onDelete }) => (
  <div className="grid gap-3 md:hidden">
    {members.map((member) => (
      <Card key={member._id} className="glass-panel border-none">
        <CardContent className="flex items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary border border-border">
              {member.data?.photoUrl ? (
                <img src={member.data.photoUrl} alt={member.data.fullName} className="size-full object-cover" />
              ) : (
                <User className="size-5" />
              )}
            </span>
            <div>
              <p className="font-medium text-foreground">{member.data?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {member.data?.relationship} • {member.data?.age} yrs ·{' '}
                <span className="capitalize">{member.data?.gender}</span>
              </p>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-1.5">
              {onEdit && (
                <Button size="icon-sm" variant="ghost" onClick={() => onEdit(member)}>
                  <Pencil className="size-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button size="icon-sm" variant="ghost" onClick={() => onDelete(member)}>
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default FamilyMemberCard;
