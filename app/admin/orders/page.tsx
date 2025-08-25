'use client';

import { useEffect, useState } from 'react';
import { Order } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                    <TableHead>Нэр</TableHead>
                    <TableHead>Утас</TableHead>
                    <TableHead>Имэйл</TableHead>
                    <TableHead>Бүтээгдэхүүн</TableHead>
                    <TableHead>Линк</TableHead>
                    <TableHead>Огноо</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.username}</TableCell>
                      <TableCell>{order.phoneNumber}</TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>{order.laptopChoice}</TableCell>
                      <TableCell>
                        {order.productLink ? (
                          <a href={order.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Линк
                          </a>
                        ) : (
                          'Байхгүй'
                        )}
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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