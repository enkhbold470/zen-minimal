'use client';

import { useEffect, useState } from 'react';
import { Order } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateOrder } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/admin/orders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order.id);
    setEditStatus(order.status || 'pending');
    setEditNotes(order.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditStatus('');
    setEditNotes('');
  };

  const handleUpdateOrder = async (orderId: number) => {
    setUpdating(true);
    try {
      const result = await updateOrder(orderId, editStatus, editNotes);
      if (result.success) {
        // Update the local state
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: editStatus, notes: editNotes, updatedAt: new Date() }
            : order
        ));
        setEditingOrder(null);
        toast({
          title: "Амжилттай",
          description: "Захиалгын мэдээлэл шинэчлэгдлээ.",
        });
      } else {
        toast({
          title: "Алдаа",
          description: result.error || "Захиалгыг шинэчлэхэд алдаа гарлаа.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Алдаа",
        description: "Захиалгыг шинэчлэхэд алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Ачаалж байна...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Алдаа гарлаа: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Захиалгын жагсаалт</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p>Захиалга олдсонгүй.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Product link</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.username}</TableCell>
                      <TableCell>{order?.phoneNumber || 'Байхгүй'}</TableCell>
                      <TableCell>{order?.email || 'Байхгүй'}</TableCell>
                      <TableCell>{order?.laptopChoice || 'Байхгүй'}</TableCell>
                      <TableCell>
                        {editingOrder === order.id ? (
                          <select 
                            value={editStatus} 
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="😴Pending">😴Pending</option>
                            <option value="🚚Shipped">🚚Shipped</option>
                            <option value="✅Complete">✅Complete</option>
                            <option value="❌Cancelled">❌Cancelled</option>
                          </select>
                        ) : (
                          order?.status || 'Байхгүй'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingOrder === order.id ? (
                          <Input
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Тэмдэглэл оруулах..."
                            className="text-sm"
                          />
                        ) : (
                          <div className="max-w-xs truncate" title={order?.notes || ''}>
                            {order?.notes || 'Байхгүй'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.productLink ? (
                          <a href={order.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {order.productLink}
                          </a>
                        ) : (
                          'Байхгүй'
                        )}
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {editingOrder === order.id ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateOrder(order.id)}
                              disabled={updating}
                            >
                              {updating ? 'Хадгалж байна...' : 'Хадгалах'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleCancelEdit}
                              disabled={updating}
                            >
                              Цуцлах
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditOrder(order)}
                          >
                            Засах
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}