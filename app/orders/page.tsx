import { Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TableCell } from "@/components/ui/table"
import { TableBody } from "@/components/ui/table"
import { TableHead } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { filteredOrders } from "@/data/orders" // Assuming filteredOrders is imported from a data file
import { CardContent } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { TableCaption } from "@/components/ui/table"
import { TableFooter } from "@/components/ui/table"

function getStatusBadge(status: string) {
  const statusConfig = {
    pending: { variant: "outline" as const, label: "Pendente" },
    processing: { variant: "default" as const, label: "Processando" },
    shipped: { variant: "secondary" as const, label: "Enviado" },
    delivered: { variant: "default" as const, label: "Entregue" },
    cancelled: { variant: "destructive" as const, label: "Cancelado" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: "outline" as const,
    label: status,
  }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Gerencie todos os pedidos da plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>{/* Footer content here */}</TableFooter>
            <TableCaption>{/* Caption content here */}</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
