
import { useState } from 'react';
import { Role, Permission } from '@/types';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RolePermissionsEditor } from './RolePermissionsEditor';

interface RoleTableRowProps {
  role: Role;
  permissions: Permission[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
}

export function RoleTableRow({
  role,
  permissions,
  onEdit,
  onDelete,
  isEditing,
  startEdit,
  cancelEdit
}: RoleTableRowProps) {
  const [editName, setEditName] = useState<string>(role.name);
  const [editDescription, setEditDescription] = useState<string>(role.description);
  const [editPermissions, setEditPermissions] = useState<string[]>(role.permissions);

  const handleSave = () => {
    if (editName.trim() !== "") {
      const updatedRole = { 
        ...role, 
        name: editName, 
        description: editDescription,
        permissions: editPermissions
      };
      onEdit(updatedRole);
    }
  };

  const handlePermissionsChange = (permissions: string[]) => {
    setEditPermissions(permissions);
  };

  return (
    <TableRow className={isEditing ? 'bg-muted/30' : ''}>
      <TableCell className="font-medium">
        {isEditing ? (
          <Input 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)}
            className="w-full"
          />
        ) : (
          role.name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Textarea 
            value={editDescription} 
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full"
            rows={2}
          />
        ) : (
          role.description
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <RolePermissionsEditor 
            permissions={permissions}
            selectedPermissions={editPermissions}
            onChange={handlePermissionsChange}
          />
        ) : (
          <div className="flex flex-wrap gap-1">
            <Badge variant="info">{role.permissions.length} izin</Badge>
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSave}
              title="Simpan"
            >
              <Save size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={cancelEdit}
              title="Batal"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={startEdit}
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(role.id)}
            >
              <Trash size={16} />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
