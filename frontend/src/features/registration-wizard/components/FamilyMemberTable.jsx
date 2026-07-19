import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// onEdit/onDelete are optional — omit both for a read-only rendering
// (reused as-is by the dashboard's Family Members card).
export const FamilyMemberTable = ({ members, onEdit, onDelete }) => {
  const readOnly = !onEdit && !onDelete;

  return (
    <div className="hidden overflow-hidden rounded-xl ring-1 ring-white/10 md:block">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-left text-xs tracking-wider text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Relationship</th>
            <th className="px-4 py-3 font-medium">Age</th>
            <th className="px-4 py-3 font-medium">Gender</th>
            {!readOnly && <th className="px-4 py-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {members.map((member) => (
            <tr key={member._id}>
              <td className="px-4 py-3 text-foreground">{member.data?.fullName}</td>
              <td className="px-4 py-3 text-muted-foreground">{member.data?.relationship}</td>
              <td className="px-4 py-3 text-muted-foreground">{member.data?.age}</td>
              <td className="px-4 py-3 text-muted-foreground capitalize">{member.data?.gender}</td>
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
