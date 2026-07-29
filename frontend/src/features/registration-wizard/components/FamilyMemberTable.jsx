import { Pencil, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FamilyMemberTable = ({ members, onEdit, onDelete }) => {
  const readOnly = !onEdit && !onDelete;

  return (
    <div className="hidden overflow-x-auto rounded-xl ring-1 ring-border md:block">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-muted text-left text-xs tracking-wider text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Photo & Name</th>
            <th className="px-4 py-3 font-medium">Relationship</th>
            <th className="px-4 py-3 font-medium">Age</th>
            <th className="px-4 py-3 font-medium">Gender</th>
            <th className="px-4 py-3 font-medium">Aadhaar</th>
            {!readOnly && <th className="px-4 py-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map((member) => (
            <tr key={member._id}>
              <td className="px-4 py-3 text-foreground font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary border border-border">
                    {member.data?.photoUrl ? (
                      <img src={member.data.photoUrl} alt={member.data.fullName} className="size-full object-cover" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </span>
                  <span>{member.data?.fullName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{member.data?.relationship}</td>
              <td className="px-4 py-3 text-muted-foreground">{member.data?.age}</td>
              <td className="px-4 py-3 text-muted-foreground capitalize">{member.data?.gender}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{member.data?.aadhaarNumber || '—'}</td>
              {!readOnly && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
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
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FamilyMemberTable;
