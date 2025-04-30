
import { useState } from 'react';
import { Role } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");

  const startEdit = (role: Role) => {
    setEditingRoleId(role.id);
    setEditName(role.name);
    setEditDescription(role.description);
  };

  const cancelEdit = () => {
    setEditingRoleId(null);
  };

  const saveEdit = (role: Role) => {
    if (editName.trim() !== "") {
      const updatedRole = { 
        ...role, 
        name: editName, 
        description: editDescription 
      };
      onEdit(updatedRole);
      setEditingRoleId(null);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Peran</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Izin Akses</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">
                {editingRoleId === role.id ? (
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
                {editingRoleId === role.id ? (
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
                <div className="flex flex-wrap gap-1">
                  <Badge variant="info">{role.permissions.length} izin</Badge>
                </div>
              </TableCell>
              <TableCell>
                {editingRoleId === role.id ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => saveEdit(role)}
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
                      onClick={() => startEdit(role)}
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
          ))}
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                Tidak ada data peran
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
